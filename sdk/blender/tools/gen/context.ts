// bpy.context's members beyond the Context struct: what the screen, the 3D view and the other editors put in the
// context (active_object, selected_objects, edit_bone, ...). RNA doesn't type them, so their types are listed here
// (as Blender's sphinx_doc_gen.py lists them); a member not listed is any.
import { jsdoc, key, type Names } from "./names";

/** member: [struct, is a list] */
const TYPES: Record<string, [string, boolean]> = {
  active_action: ["Action", false], active_annotation_layer: ["AnnotationLayer", false], active_bone: ["EditBone", false],
  active_editable_fcurve: ["FCurve", false], active_file: ["FileSelectEntry", false], active_nla_strip: ["NlaStrip", false],
  active_nla_track: ["NlaTrack", false], active_node: ["Node", false], active_object: ["Object", false],
  active_operator: ["Operator", false], active_pose_bone: ["PoseBone", false], active_strip: ["Strip", false],
  annotation_data: ["Annotation", false], annotation_data_owner: ["ID", false], armature: ["Armature", false],
  asset: ["AssetRepresentation", false], bone: ["Bone", false], brush: ["Brush", false], camera: ["Camera", false],
  cloth: ["ClothModifier", false], collision: ["CollisionModifier", false], curve: ["Curve", false], curves: ["Curves", false],
  dynamic_paint: ["DynamicPaintModifier", false], edit_bone: ["EditBone", false], edit_image: ["Image", false],
  edit_mask: ["Mask", false], edit_movieclip: ["MovieClip", false], edit_object: ["Object", false], edit_text: ["Text", false],
  editable_bones: ["EditBone", true], editable_fcurves: ["FCurve", true], editable_objects: ["Object", true],
  fluid: ["FluidModifier", false], grease_pencil: ["GreasePencil", false], id: ["ID", false],
  image_paint_object: ["Object", false], lattice: ["Lattice", false], light: ["Light", false], lightprobe: ["LightProbe", false],
  line_style: ["FreestyleLineStyle", false], material: ["Material", false], material_slot: ["MaterialSlot", false],
  mesh: ["Mesh", false], meta_ball: ["MetaBall", false], object: ["Object", false], objects_in_mode: ["Object", true],
  objects_in_mode_unique_data: ["Object", true], particle_edit_object: ["Object", false], particle_settings: ["ParticleSettings", false],
  particle_system: ["ParticleSystem", false], particle_system_editable: ["ParticleSystem", false], pointcloud: ["PointCloud", false],
  pose_bone: ["PoseBone", false], pose_object: ["Object", false], sculpt_object: ["Object", false],
  selectable_objects: ["Object", true], selected_assets: ["AssetRepresentation", true], selected_bones: ["EditBone", true],
  selected_editable_actions: ["Action", true], selected_editable_bones: ["EditBone", true],
  selected_editable_fcurves: ["FCurve", true], selected_editable_keyframes: ["Keyframe", true],
  selected_editable_objects: ["Object", true], selected_editable_strips: ["Strip", true], selected_files: ["FileSelectEntry", true],
  selected_ids: ["ID", true], selected_movieclip_tracks: ["MovieTrackingTrack", true], selected_nla_strips: ["NlaStrip", true],
  selected_nodes: ["Node", true], selected_objects: ["Object", true], selected_pose_bones: ["PoseBone", true],
  selected_pose_bones_from_active_object: ["PoseBone", true], selected_strips: ["Strip", true],
  selected_visible_actions: ["Action", true], selected_visible_fcurves: ["FCurve", true], sequencer_scene: ["Scene", false],
  soft_body: ["SoftBodyModifier", false], speaker: ["Speaker", false], strips: ["Strip", true], texture: ["Texture", false],
  texture_slot: ["TextureSlot", false], texture_user: ["ID", false], texture_user_property: ["Property", false],
  ui_list: ["UIList", false], vertex_paint_object: ["Object", false], visible_bones: ["EditBone", true],
  visible_fcurves: ["FCurve", true], visible_objects: ["Object", true], visible_pose_bones: ["PoseBone", true],
  volume: ["Volume", false], weight_paint_object: ["Object", false], world: ["World", false],
};

/** The members the screen and editors add to Context, as an interface extending it. */
export function emitContext(members: string[], own: Set<string>, n: Names): string {
  const all = [...new Set([...members, ...Object.keys(TYPES)])].filter((m) => !own.has(m) && !m.startsWith("_")).sort();
  const body = all.map((m) => {
    const t = TYPES[m];
    const struct = t && n.rna.has(t[0]) ? t[0] : null;
    if (!struct) return `${jsdoc(`bpy.context.${m}`)}  readonly ${key(m)}: any;`;
    const ty = t[1] ? `H.Seq<R.${struct}>` : `H.Ptr<R.${struct}>`;
    return `${jsdoc(`bpy.context.${m}: ${t[1] ? `a list of ${struct}` : struct}, where the current editor has one (else ${t[1] ? "empty" : "None"}).`)}  readonly ${key(m)}: ${ty};`;
  });
  return `${jsdoc("bpy.context: the Context struct, and what the screen and the current editor add to it.", "")}export interface Context extends R.Context {\n${body.join("\n")}\n}\n`;
}
