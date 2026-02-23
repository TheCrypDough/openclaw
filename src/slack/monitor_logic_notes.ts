/*
 * AUTO ANNOTATION
 * File: src/slack/monitor.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { buildSlackSlashCommandMatcher } from "./monitor/commands.js";
export { isSlackChannelAllowedByPolicy } from "./monitor/policy.js";
export { monitorSlackProvider } from "./monitor/provider.js";
export { resolveSlackThreadTs } from "./monitor/replies.js";
export type { MonitorSlackOpts } from "./monitor/types.js";
