/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type {
  MatrixActionClientOpts,
  MatrixMessageSummary,
  MatrixReactionSummary,
} from "./actions/types.js";
export {
  sendMatrixMessage,
  editMatrixMessage,
  deleteMatrixMessage,
  readMatrixMessages,
} from "./actions/messages.js";
export { listMatrixReactions, removeMatrixReactions } from "./actions/reactions.js";
export { pinMatrixMessage, unpinMatrixMessage, listMatrixPins } from "./actions/pins.js";
export { getMatrixMemberInfo, getMatrixRoomInfo } from "./actions/room.js";
export { reactMatrixMessage } from "./send.js";
