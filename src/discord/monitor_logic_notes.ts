/*
 * AUTO ANNOTATION
 * File: src/discord/monitor.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type {
  DiscordAllowList,
  DiscordChannelConfigResolved,
  DiscordGuildEntryResolved,
} from "./monitor/allow-list.js";
export {
  allowListMatches,
  isDiscordGroupAllowedByPolicy,
  normalizeDiscordAllowList,
  normalizeDiscordSlug,
  resolveDiscordChannelConfig,
  resolveDiscordChannelConfigWithFallback,
  resolveDiscordCommandAuthorized,
  resolveDiscordGuildEntry,
  resolveDiscordShouldRequireMention,
  resolveGroupDmAllow,
  shouldEmitDiscordReactionNotification,
} from "./monitor/allow-list.js";
export type { DiscordMessageEvent, DiscordMessageHandler } from "./monitor/listeners.js";
export { registerDiscordListener } from "./monitor/listeners.js";

export { createDiscordMessageHandler } from "./monitor/message-handler.js";
export { buildDiscordMediaPayload } from "./monitor/message-utils.js";
export { createDiscordNativeCommand } from "./monitor/native-command.js";
export type { MonitorDiscordOpts } from "./monitor/provider.js";
export { monitorDiscordProvider } from "./monitor/provider.js";

export { resolveDiscordReplyTarget, sanitizeDiscordThreadName } from "./monitor/threading.js";
