/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { buildCommandContext } from "./commands-context.js";
export { handleCommands } from "./commands-core.js";
export { buildStatusReply } from "./commands-status.js";
export type {
  CommandContext,
  CommandHandlerResult,
  HandleCommandsParams,
} from "./commands-types.js";
