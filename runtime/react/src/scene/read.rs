//! A frame's 3D read from the React tree: each part's props and names, cached across frames.

use super::*;

/// A part's props from its data-props text: parsed again only when the text changed since the last scene
pub(crate) fn props3d(e: Entity, text: Option<&str>) -> std::sync::Arc<Map<String, Value>> {
    let Some(text) = text else { return std::sync::Arc::default() };
    let now = SCENE3D.with(|g| g.get());
    PROPS3D.with(|c| {
        let mut c = c.borrow_mut();
        if let Some((t, p, seen)) = c.get_mut(&e) {
            *seen = now;
            if t.as_str() == text {
                return p.clone();
            }
            // in place where no one else holds them (the last scene let go) and the keys are the same: each value
            // updated where it is (ZeroHeap: a moving part's props were parsed into a new map each frame)
            if let Some(m) = std::sync::Arc::get_mut(p)
                && props_in_place(m, text)
            {
                t.clear();
                t.push_str(text);
                return p.clone();
            }
            let parsed: Map<String, Value> = serde_json::from_str(text).unwrap_or_default();
            t.clear();
            t.push_str(text);
            *p = std::sync::Arc::new(parsed);
            return p.clone();
        }
        let p = std::sync::Arc::new(serde_json::from_str::<Map<String, Value>>(text).unwrap_or_default());
        c.insert(e, (text.to_string(), p.clone(), now));
        p
    })
}

/// A part's kind and shape, the shared ones from its last read when they're the same
pub(crate) fn names3d(e: Entity, kind: &str, shape: Option<&str>) -> (std::sync::Arc<str>, Option<std::sync::Arc<str>>) {
    NAMES3D.with_borrow_mut(|c| {
        if let Some((k, s)) = c.get(&e)
            && &**k == kind
            && s.as_deref() == shape
        {
            return (k.clone(), s.clone());
        }
        let v: (std::sync::Arc<str>, Option<std::sync::Arc<str>>) = (kind.into(), shape.map(Into::into));
        // bounded well past a big scene's parts (many_cubes has 10,000; at 8,192 it was cleared every frame)
        if c.len() > 1 << 17 {
            c.clear();
        }
        c.insert(e, v.clone());
        v
    })
}

/// `m` set to the object `text` holds, value by value in place: false (`m` then partly updated) when it isn't an
/// object with the same keys
pub(crate) fn props_in_place(m: &mut Map<String, Value>, text: &str) -> bool {
    let Ok(raw) = serde_json::from_str::<&serde_json::value::RawValue>(text) else { return false };
    if !raea_core_wire::raw::is_object(raw) {
        return false;
    }
    let (mut n, mut ok) = (0usize, true);
    raea_core_wire::raw::each_entry(raw, |k, v| {
        n += 1;
        if m.contains_key(k) {
            raea_core_wire::raw::put_raw(m, k, v);
        } else {
            ok = false;
        }
    });
    ok && n == m.len()
}

/// What each React entity puts into its 3D parent's kids, kept across scenes: a part is one node, a plain element the
/// 3D under it. Only the entities touched since the last scene, and their ancestors, are read again; the rest are
/// handed on for an Arc's count (docs/control.feature FC1b: many_cubes' 10,000 parts were re-read for a camera's move)
#[derive(Resource, Default)]
pub struct Kept3d {
    pub(crate) of: bevy::ecs::entity::EntityHashMap<std::sync::Arc<[Node3]>>,
    /// parents a commit took a child from (Bevy drops an empty Children, which no change filter sees)
    pub(crate) touched: Vec<Entity>,
    /// everything to be read again (a reset, the first scene)
    pub(crate) all: bool,
}

/// The entities whose props or children changed since the last scene, by Bevy's change ticks
#[derive(Resource)]
pub(crate) struct Watch3d(bevy::ecs::system::SystemState<Query<'static, 'static, Entity, Or<(Changed<ReactProps>, Changed<Children>, Changed<ChildOf>)>>>);

/// A commit's note that `e`'s parent loses it (a remove, or a move by append or insert)
pub(crate) fn touch_parent(world: &mut World, e: Entity) {
    // the 3D's holders are worked out again too (holders.rs HolderCache)
    if let Some(mut h) = world.get_resource_mut::<super::holders::HolderCache>() {
        h.stale = true;
    }
    if let Some(p) = world.get::<ChildOf>(e).map(|c| c.parent())
        && let Some(mut k) = world.get_resource_mut::<Kept3d>()
    {
        k.touched.push(p);
    }
}

/// The entities to read again: those changed since the last scene and every ancestor of each
pub(crate) fn dirty3d(world: &mut World) -> bevy::ecs::entity::EntityHashSet {
    if !world.contains_resource::<Watch3d>() {
        let s = bevy::ecs::system::SystemState::new(world);
        world.insert_resource(Watch3d(s));
        world.insert_resource(Kept3d { all: true, ..default() });
    }
    // None: the watch couldn't be read, so everything is read again
    let seen: Option<Vec<Entity>> = world.resource_scope(|world, mut w: Mut<Watch3d>| w.0.get(world).ok().map(|q| q.iter().collect()));
    let all = seen.is_none();
    let mut seeds = seen.unwrap_or_default();
    // what's changed directly on the World after this (not by a system) has a newer tick than this read
    world.increment_change_tick();
    let mut kept = world.resource_mut::<Kept3d>();
    seeds.append(&mut kept.touched);
    if std::mem::take(&mut kept.all) || all {
        kept.of.clear();
    }
    let mut dirty = bevy::ecs::entity::EntityHashSet::default();
    for mut e in seeds {
        while dirty.insert(e) {
            match world.get::<ChildOf>(e) {
                Some(c) => e = c.parent(),
                None => break,
            }
        }
    }
    let mut kept = world.resource_mut::<Kept3d>();
    // let go before reading, so a part's props can be updated in place where nothing else holds them
    for e in &dirty {
        kept.of.remove(e);
    }
    dirty
}

/// What `e` puts into its 3D parent's kids: kept from the last scene when it isn't dirty
pub(crate) fn contrib3d(world: &World, e: Entity, kept: &mut Kept3d, dirty: &bevy::ecs::entity::EntityHashSet) -> std::sync::Arc<[Node3]> {
    if !dirty.contains(&e)
        && let Some(c) = kept.of.get(&e)
    {
        return c.clone();
    }
    let c: std::sync::Arc<[Node3]> = match read3d(world, e, kept, dirty) {
        Some(n) => std::sync::Arc::new([n]),
        None => {
            let mut v = Vec::new();
            kids3d(world, e, kept, dirty, &mut v);
            v.into()
        }
    };
    kept.of.insert(e, c.clone());
    c
}

pub(crate) fn read3d(world: &World, e: Entity, kept: &mut Kept3d, dirty: &bevy::ecs::entity::EntityHashSet) -> Option<Node3> {
    let p = world.get::<ReactProps>(e)?;
    let (kind, shape) = names3d(e, p.0.get("data-3d")?.as_str()?, p.0.get("data-shape").and_then(|v| v.as_str()));
    let props = props3d(e, p.0.get("data-props").and_then(|v| v.as_str()));
    // a world's entities (<Entities>): its scene, already in world space, as meshes with their materials
    if &*kind == "Entities" {
        return Some(Node3 { kind, props: std::sync::Arc::default(), shape: None, at: None, kids: raea_core_scene::entities_nodes(&props).into() });
    }
    let mut kids = Vec::new();
    kids3d(world, e, kept, dirty, &mut kids);
    Some(Node3 { kind, props, shape, at: at3d(e, p.0.get("data-at").and_then(|v| v.as_str())), kids: kids.into() })
}

/// A part's data-at, the same Arc while its text is the same: kept frames share one list (issue 84)
fn at3d(e: Entity, text: Option<&str>) -> Option<std::sync::Arc<str>> {
    let text = text?;
    AT3D.with_borrow_mut(|c| match c.get(&e) {
        Some(a) if &**a == text => Some(a.clone()),
        _ => Some(c.entry(e).insert(text.into()).get().clone()),
    })
}

/// The 3D children of `e` through plain elements between them (a Sequence's or a component's wrapper div), a kept
/// child's nodes copied from where they're kept (with its list's count bumped and let go, 100 000 lights took 3.9 ms)
pub(crate) fn kids3d(world: &World, e: Entity, kept: &mut Kept3d, dirty: &bevy::ecs::entity::EntityHashSet, out: &mut Vec<Node3>) {
    let Some(children) = world.get::<Children>(e) else { return };
    for k in children.iter() {
        match kept.of.get(&k).filter(|_| !dirty.contains(&k)) { Some(c) => out.extend(c.iter().cloned()), None => out.extend(contrib3d(world, k, kept, dirty).iter().cloned()) }
    }
}
