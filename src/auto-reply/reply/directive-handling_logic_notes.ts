/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/directive-handling.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { applyInlineDirectivesFastLane } from "./directive-handling.fast-lane.js";
export * from "./directive-handling.impl.js";
export type { InlineDirectives } from "./directive-handling.parse.js";
export { isDirectiveOnly, parseInlineDirectives } from "./directive-handling.parse.js";
export { persistInlineDirectives, resolveDefaultModel } from "./directive-handling.persist.js";
export { formatDirectiveAck } from "./directive-handling.shared.js";
