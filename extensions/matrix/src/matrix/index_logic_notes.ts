/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { monitorMatrixProvider } from "./monitor/index.js";
export { probeMatrix } from "./probe.js";
export {
  reactMatrixMessage,
  resolveMatrixRoomId,
  sendReadReceiptMatrix,
  sendMessageMatrix,
  sendPollMatrix,
  sendTypingMatrix,
} from "./send.js";
export { resolveMatrixAuth, resolveSharedMatrixClient } from "./client.js";
