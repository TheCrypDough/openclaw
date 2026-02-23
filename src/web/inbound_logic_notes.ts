/*
 * AUTO ANNOTATION
 * File: src/web/inbound.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { resetWebInboundDedupe } from "./inbound/dedupe.js";
export { extractLocationData, extractMediaPlaceholder, extractText } from "./inbound/extract.js";
export { monitorWebInbox } from "./inbound/monitor.js";
export type { WebInboundMessage, WebListenerCloseReason } from "./inbound/types.js";
