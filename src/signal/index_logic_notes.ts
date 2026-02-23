/*
 * AUTO ANNOTATION
 * File: src/signal/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { monitorSignalProvider } from "./monitor.js";
export { probeSignal } from "./probe.js";
export { sendMessageSignal } from "./send.js";
export { sendReactionSignal, removeReactionSignal } from "./send-reactions.js";
export { resolveSignalReactionLevel } from "./reaction-level.js";
