/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export {
  extractElevatedDirective,
  extractReasoningDirective,
  extractThinkDirective,
  extractVerboseDirective,
} from "./reply/directives.js";
export { getReplyFromConfig } from "./reply/get-reply.js";
export { extractExecDirective } from "./reply/exec.js";
export { extractQueueDirective } from "./reply/queue.js";
export { extractReplyToTag } from "./reply/reply-tags.js";
export type { GetReplyOptions, ReplyPayload } from "./types.js";
