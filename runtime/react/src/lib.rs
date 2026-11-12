//! React on JavaScriptCore inside Bevy (docs/bevy.feature, B2-B3). A JS thread owns the context and runs a bundle
//! (React, react-reconciler, bevy-react's bridge, the app); each React commit arrives as one op batch (bevy-react's
//! wire protocol) over a channel, and a Bevy system applies it to entities: every host element an entity, the tree as
//! Bevy's hierarchy, its kind, props and text as components. No deno_core: raea's context provides `__bevyHost` itself.

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::mpsc::{Receiver, Sender, channel};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use bevy::prelude::*;

pub mod animate;
/// ZeroHeap Z4: per-frame update ops read in place
/// ZeroHeap Z1: the counting allocator raea installs (RAEA_ZEROHEAP=1)
/// a page in the 3D world: world and surface layers (docs/blitz-bevy.feature B3 H5)
pub mod layers;
pub mod scene;
/// raea's 2D page on bevy_ui (P26): every render's and live play's
/// React's on* props on the entities it makes: Bevy picking's pointer events to their handlers (S2c, B3 H3)
pub mod pointer;
/// state React and the World share: useResource, useComponent (docs/blitz-bevy.feature B3 H4)
pub use raea_runtime_shared::{self as shared, ReactOutbox};
pub use raea_runtime_calls::{self as native, CLI};
use serde_json::Value;

mod thread;
use thread::*;
pub use thread::register_natives;
mod commits;
use commits::*;

const PRELUDE: &str = include_str!("../../../sdk/react/js/src/prelude.js");

/// The id React gives the root container (bevy-react's ROOT_ID).
pub const ROOT_ID: u64 = 0;

/// A React host element (or text node): its id on the wire.
#[derive(Component, Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ReactNode(pub u64);

/// The element's kind as React named it (`div`, `span`, `mesh`, ...); text nodes are `#text`.
#[derive(Component, Debug, Clone)]
pub struct ReactKind(pub String);

/// Its props as last applied (deltas merged in).
#[derive(Component, Debug, Clone, Default)]
pub struct ReactProps(pub serde_json::Map<String, Value>);

/// Its text, for text nodes and single-string elements.
#[derive(Component, Debug, Clone)]
pub struct ReactText(pub String);

/// The React root: the entity every top-level element hangs from.
#[derive(Component, Debug)]
pub struct ReactRoot;

/// One commit's ops, as the bridge flushed them (JSON).
pub(crate) struct Batch(String);

#[derive(Resource)]
struct Inbox(Mutex<Receiver<Batch>>);

/// Wire ids to entities.
#[derive(Resource, Default)]
pub struct ReactEntities {
    pub by_id: HashMap<u64, Entity>,
    /// how many commits and ops have been applied
    pub commits: usize,
    pub ops: usize,
}

/// Runs a React bundle on its own JS thread and applies its commits to the World each frame.
pub struct ReactPlugin {
    pub bundle: PathBuf,
}

impl ReactPlugin {
    pub fn new(bundle: impl Into<PathBuf>) -> Self {
        ReactPlugin { bundle: bundle.into() }
    }
}

/// the camera view's box as last laid out (raea-runtime-page's `view_box`), for 3D picking in it (native `page.viewBox`)
pub static VIEW_BOX: std::sync::Mutex<Option<[u32; 4]>> = std::sync::Mutex::new(None);

/// Commit batches as they're applied, when present (bake.rs records a composition's commits by frame).
#[derive(Resource, Default)]
pub struct CommitTap(pub Vec<String>);

/// One commit applied per update, the rest held in order (a bake stepping a range of frames: React renders them back
/// to back, and each frame's commit is still applied, read and recorded on its own; lightspeed T3).
#[derive(Resource, Default)]
pub struct OneBatch(pub(crate) std::collections::VecDeque<Batch>);

/// React's place in the ECS with no JS behind it: recorded commits are fed in (ReplayFeed) and applied as React's
/// would be. A baked timeline plays through this, nothing of V8 running.
pub struct ReplayPlugin;

/// Where a replay's commit batches go in.
#[derive(Resource)]
pub struct ReplayFeed(Mutex<Sender<Batch>>);

impl ReplayFeed {
    pub fn feed(&self, json: String) {
        let _ = self.0.lock().unwrap().send(Batch(json));
    }
}

impl Plugin for ReplayPlugin {
    fn build(&self, app: &mut App) {
        let (tx, rx) = channel();
        // events have no one to go to: sent into a channel nobody reads
        let (out_tx, _) = channel::<String>();
        app.insert_resource(ReactOutbox(Mutex::new(out_tx))).insert_resource(ReplayFeed(Mutex::new(tx)));
        let root = app.world_mut().spawn((ReactRoot, ReactNode(ROOT_ID), ReactKind("#root".into()))).id();
        let mut ents = ReactEntities::default();
        ents.by_id.insert(ROOT_ID, root);
        app.insert_resource(Inbox(Mutex::new(rx))).insert_resource(ents).add_systems(PreUpdate, apply_commits);
        add_animate(app);
        // the hooks' channel to the World (shared.rs, B3 H4): useResource, useQuery, useEntity... reach it in any App
        shared::setup(app);
    }
}

/// Declared animations (motion's <Animate>, raea-animate) sampled at the frame clock once React's commits are in.
fn add_animate(app: &mut App) {
    app.add_plugins(raea_sys_animate::AnimatePlugin).add_systems(PreUpdate, animate::sample_animations.after(apply_commits));
}

/// The tree under React's root as ops that build it from nothing (create, then append, parents first): a baked
/// timeline's keyframe, which a seek replays after removing what's there.
pub fn snapshot_ops(world: &World) -> Vec<Value> {
    let Some(&root) = world.get_resource::<ReactEntities>().and_then(|e| e.by_id.get(&ROOT_ID)) else { return Vec::new() };
    let mut out = Vec::new();
    fn walk(world: &World, e: Entity, out: &mut Vec<Value>) {
        let Some(kids) = world.get::<Children>(e) else { return };
        let parent = world.get::<ReactNode>(e).map(|n| n.0).unwrap_or(ROOT_ID);
        for k in kids.iter() {
            let Some(id) = world.get::<ReactNode>(k).map(|n| n.0) else { continue };
            let kind = world.get::<ReactKind>(k).map(|k| k.0.clone()).unwrap_or_default();
            let text = world.get::<ReactText>(k).map(|t| t.0.clone());
            match kind.as_str() {
                "#text" => out.push(serde_json::json!({"op": "createText", "id": id, "text": text.unwrap_or_default()})),
                "#span" => out.push(serde_json::json!({"op": "createTextSpan", "id": id, "text": text.unwrap_or_default()})),
                _ => {
                    let props = world.get::<ReactProps>(k).map(|p| Value::Object(p.0.clone())).unwrap_or(Value::Object(Default::default()));
                    let mut op = serde_json::json!({"op": "create", "id": id, "kind": kind, "props": props});
                    if let Some(t) = text {
                        op["text"] = Value::String(t);
                    }
                    out.push(op);
                }
            }
            walk(world, k, out);
            out.push(serde_json::json!({"op": "append", "parent": parent, "child": id}));
        }
    }
    walk(world, root, &mut out);
    out
}

impl Plugin for ReactPlugin {
    fn build(&self, app: &mut App) {
        let (tx, rx) = channel();
        let (out_tx, out_rx) = channel::<String>();
        let bundle = self.bundle.clone();
        std::thread::Builder::new()
            .name("raea-runtime-react js".into())
            .spawn(move || {
                // JavaScriptCore on Apple (the system's engine, the JIT on with the entitlement tools/link-jit.sh signs in),
                // QuickJS elsewhere
                js_thread(bundle, tx, out_rx)
            })
            .expect("the JS thread");
        app.insert_resource(ReactOutbox(Mutex::new(out_tx)));
        let root = app.world_mut().spawn((ReactRoot, ReactNode(ROOT_ID), ReactKind("#root".into()))).id();
        let mut ents = ReactEntities::default();
        ents.by_id.insert(ROOT_ID, root);
        app.insert_resource(Inbox(Mutex::new(rx))).insert_resource(ents).add_systems(PreUpdate, apply_commits);
        add_animate(app);
        // the hooks' channel to the World (shared.rs, B3 H4): useResource, useQuery, useEntity... reach it in any App
        shared::setup(app);
        // onClick, onPointerDown, onWheel ... on a mesh or a node: Bevy picking's events to React's handlers
        pointer::setup(app);
    }
}

thread_local! {
    static FLUSH: std::cell::RefCell<Option<Sender<Batch>>> = const { std::cell::RefCell::new(None) };
}

/// The bundle's own throw while it was evaluated (before React committed anything): a render waiting for its first
/// commit says it instead of timing out blind
pub static BUNDLE_ERROR: Mutex<Option<String>> = Mutex::new(None);

/// Commits React has flushed so far, and a wake for whoever waits on the next (a render waits for its frame's commit
/// instead of polling with sleeps).
static FLUSHED: (Mutex<u64>, std::sync::Condvar) = (Mutex::new(0), std::sync::Condvar::new());

/// Where a frame's step goes: nanoseconds the JS thread ran (timers, events, microtasks), nanoseconds Bevy spent
/// applying commits (JSON parse, entities, the page mirror), and bytes of commit JSON sent. Read as deltas per frame.
pub static JS_NS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
/// When the JS threads' current calls began, in ms after JS_BASE plus 1 (0: none is in a call): a render's settle counts
/// a call still running as progress (a frame's render under load can take seconds before its first flush). A render runs
/// several runtimes, each with a JS thread, so JS_CALLS counts the calls under way and the time is cleared only when the
/// last ends: one thread's call ending zeroed it while another's ran on (film.tsx frame 1334 under load, 10-27).
pub static JS_CALL_SINCE: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub static JS_BASE: std::sync::LazyLock<Instant> = std::sync::LazyLock::new(Instant::now);
pub static JS_CALLS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
/// Which call began the current run of calls: its runtime (numbered as each JS thread starts, from 1) times 2, plus 1
/// for an event's delivery (__raea_deliver: a frame's render) or 0 for timers (__raea_timers), so a hang's refusal
/// names it
static JS_CALL_WHO: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
static JS_RUNTIMES: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
thread_local! {
    static JS_RUNTIME: std::cell::Cell<u64> = const { std::cell::Cell::new(0) };
}

/// The call that began the current run of calls, in words: "JS runtime 2 of 3's __raea_deliver (a frame's render)".
pub fn js_call_who() -> String {
    let who = JS_CALL_WHO.load(std::sync::atomic::Ordering::SeqCst);
    let what = if who % 2 == 1 { "__raea_deliver (a frame's render)" } else { "__raea_timers (its timers and effects)" };
    format!("JS runtime {} of {}'s {what}", who / 2, JS_RUNTIMES.load(std::sync::atomic::Ordering::SeqCst))
}

/// How long the JS threads have been in calls without a break, if one is in a call (JS_CALLS decides: an ending call can
/// clear the time just after another began, which reads as a call just begun).
pub fn js_call_for() -> Option<Duration> {
    use std::sync::atomic::Ordering::SeqCst;
    if JS_CALLS.load(SeqCst) == 0 {
        return None;
    }
    let at = JS_CALL_SINCE.load(SeqCst);
    Some(if at == 0 { Duration::ZERO } else { JS_BASE.elapsed().saturating_sub(Duration::from_millis(at - 1)) })
}

fn js_call_begins(deliver: bool) {
    use std::sync::atomic::Ordering::SeqCst;
    if JS_CALLS.fetch_add(1, SeqCst) == 0 {
        JS_CALL_WHO.store(JS_RUNTIME.get() * 2 + deliver as u64, SeqCst);
        JS_CALL_SINCE.store(JS_BASE.elapsed().as_millis() as u64 + 1, SeqCst);
    }
}

fn js_call_ends() {
    use std::sync::atomic::Ordering::SeqCst;
    if JS_CALLS.fetch_sub(1, SeqCst) == 1 {
        JS_CALL_SINCE.store(0, SeqCst);
    }
}
/// This thread at macOS's user-interactive QoS (the class a game's frame threads get): under load from other processes a
/// default-QoS JS thread was preempted for ~30 ms at a time, and a 120 fps game missed frames (pong: 8 in 36,000 with a
/// load average of 4-10). Live play's JS thread and the thread that steps its frames take it.
pub fn interactive_thread() {
    #[cfg(target_vendor = "apple")]
    {
        unsafe extern "C" {
            fn pthread_set_qos_class_self_np(qos: u32, relative_priority: i32) -> i32;
        }
        const QOS_CLASS_USER_INTERACTIVE: u32 = 0x21;
        unsafe { pthread_set_qos_class_self_np(QOS_CLASS_USER_INTERACTIVE, 0) };
    }
}

/// Nanoseconds the JS thread spent giving JavaScriptCore's free pages back (RAEA_JSC_RELEASE_S).
pub static RELEASE_NS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

/// Nanoseconds the JS thread spent in young collections after frames (RAEA_JSC_EDEN), reported by the playtest.
pub static EDEN_NS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub static APPLY_NS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub static FLUSH_BYTES: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
/// Rust allocations (count, bytes) applying React's ops on Bevy's side, and taking a flush's batch on the JS thread
/// (ZeroHeap Z1/Z4: RAEA_ZEROHEAP=1 under raea; 0 otherwise)
pub static APPLY_ALLOCS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub static APPLY_ALLOC_BYTES: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub static FLUSH_ALLOCS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

/// How many commits React has flushed.
/// RAEA_STARTUP_TRACE=<the spawner's clock, ms since the Unix epoch>: each mark printed with its time since the spawn
/// (lightspeed F5: where a process's time to its first frame goes). Unset, a mark costs one cached env read.
pub fn startup_mark(what: &str) {
    static SPAWN: std::sync::OnceLock<Option<f64>> = std::sync::OnceLock::new();
    if let Some(t0) = SPAWN.get_or_init(|| std::env::var("RAEA_STARTUP_TRACE").ok().and_then(|v| v.parse().ok())) {
        let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_secs_f64() * 1e3).unwrap_or(0.0);
        let gpu = raea_runtime_view::gpuview::paint_device().and_then(|g| g.device.generate_allocator_report()).map_or(-1.0, |r| r.total_allocated_bytes as f64 / 1e6);
        eprintln!("raea startup: {:7.1} ms  {what}  (gpu {gpu:.1} MB)", now - t0);
    }
}

/// What the `raea` binary does before a verb that runs the engine: the Bevy plugins this build has (avian, hanabi,
/// tweening features: every Engine adds them) and the bridge's `bevy.app.*` natives, which raea/bevy's BevyApp runs
/// on (install_all; install alone left a raea/bevy program with "no native call", 10-29), the world's calls left to
/// the Engine, and the Engine's reads.
pub fn start() {
    #[cfg(feature = "bevy-plugins")]
    raea_bevy_plugins::install_all();
    startup_mark("bevy plugins installed");
    // render and play run a world's calls on the Engine, whose names are the edit's, made after the page's first
    // frames: React's App leaves the queue to it (shared.rs drains it only in a plain App's process)
    raea_bevy_world::claim();
    // the Engine's reads (on unless RAEA_ENGINE_READS=0): React's watches, reads and systems answered by the Engine's
    // World (shared.rs)
    if shared::engine_reads_asked() {
        raea_runtime_plugins::register(raea_runtime_plugins::Registered { name: "react_share", install: shared::engine_side, group: None, on_demand: false });
    }
}

pub fn flushed() -> u64 {
    *FLUSHED.0.lock().unwrap()
}

/// Block until React flushes a commit after the `seen`-th, or `timeout` passes; the count now.
pub fn wait_flush(seen: u64, timeout: Duration) -> u64 {
    let (n, cv) = &FLUSHED;
    let t0 = Instant::now();
    let g = n.lock().unwrap();
    let (g, r) = cv.wait_timeout_while(g, timeout, |c| *c <= seen).unwrap();
    FLUSH_WAIT_NS.fetch_add(t0.elapsed().as_nanos() as u64, std::sync::atomic::Ordering::Relaxed);
    if r.timed_out() {
        FLUSH_TIMEOUTS.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    }
    *g
}

/// Time spent waiting on React's flushes (wait_flush), in nanoseconds: what a bake's step waited on the JS thread
pub static FLUSH_WAIT_NS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

/// Waits for a flush that ran out their time (wait_flush): a step that waited on React for nothing
pub static FLUSH_TIMEOUTS: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

