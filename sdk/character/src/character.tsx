// @raea/character/character: people. A character is an Anny body (sdk/raea/tools/anny/character.py writes one: a
// skinned glb in the playtest's graph paper, its ink hull, and its skeleton) on MakeHuman's game_engine rig (bones.ts). Its
// pose comes from one place (a held pose, a clip at the frame's time, or the motion matcher), and goals on top of it
// put its hands, feet, gaze and seat where the scene's things are, said in the scene's own terms ("the right hand on
// the mouse, flat"), never in body-frame numbers.
//
//   import kid from "./media/characters/kid/skeleton.json" with { type: "json" };
//   registerBody(kid);                                                            // its glbs in media/characters/kid
//   const pose = held(kid, { upperarm_r: [-0.2, -0.6, 0.75] });                       // or clipPose(clip, t), or the matcher
//   <Character body="kid" pose={pose} position={[0, 0, 1]} yaw={Math.PI}
//     goals={{ hands: { R: { at: MOUSE, point: [0, 0, -1] } }, look: SCREEN }} />
//
// Every joint's rest frame is the world's (the T-pose the skin is bound in, no bone roll), so a joint's turn is the same
// kind of thing a BVH file gives: a rotation from rest, relative to its parent's. Frame-pure: a pose is a function of
// its inputs, so a render and a live play agree.
export { I, handRest, B, SIDES, BODY_JOINTS, FINGER_JOINTS, sideOf, mirrorName, roleOf, isFinger, skinJoints, add, sub, scale3, dot, cross, len, norm, qmul, qinv, qnorm, qrot, qaxis, qfromTo, slerp, qbasis, eulerXYZ, qyaw, joint, bodyScale, captured, rest, pose, withFingers, setWorld, held, aim, twoBone, softElbows, flatHand, cupHand, ballInHand, palmAt, handAlong, palmFacing, FINGERS, fingerJoints, HAND_LIMITS, RELAXED_HAND, RELAXED_CAPTURE, relaxHands, handPose, capturedHand, HAND_POSES, capturedLocal, alongPath, pathHand, pinchPoint, SKIN_GIVE, closeOn, fingerSegments, surface, handSurface, reach, plant, lookAt, sit, blend, leanToward, solve, toBody, toScene, goalsToBody, registerBody, Character, FACE_UNITS, FACE_PRESETS, faceWeights, HAIR_LOOK, HAIR_WESL, SKIN_LOOK, SKIN_SURFACE, SKIN_WESL } from "./character/all";
export type { Quat, Joint, Skeleton, Pose, Posed, Side, Finger, HandShape, Closing, FingerSegment, SurfacePoint, HandGoal, FootGoal, SeatGoal, Goals, Placement, CharacterProps, CharacterGhost, FaceUnit, FacePreset, Face, HairLook } from "./character/all";


