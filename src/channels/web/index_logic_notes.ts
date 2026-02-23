/*
 * AUTO ANNOTATION
 * File: src/channels/web/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/* istanbul ignore file */
export {
  createWaSocket,
  loginWeb,
  logWebSelfId,
  monitorWebChannel,
  monitorWebInbox,
  pickWebChannel,
  sendMessageWhatsApp,
  WA_WEB_AUTH_DIR,
  waitForWaConnection,
  webAuthExists,
} from "../../channel-web.js";
