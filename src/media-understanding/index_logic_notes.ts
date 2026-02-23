/*
 * AUTO ANNOTATION
 * File: src/media-understanding/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { applyMediaUnderstanding } from "./apply.js";
export { formatMediaUnderstandingBody } from "./format.js";
export { resolveMediaUnderstandingScope } from "./scope.js";
export type {
  MediaAttachment,
  MediaUnderstandingOutput,
  MediaUnderstandingProvider,
  MediaUnderstandingKind,
} from "./types.js";
