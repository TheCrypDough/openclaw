/*
 * AUTO ANNOTATION
 * File: src/commands/channels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type { ChannelsAddOptions } from "./channels/add.js";
export { channelsAddCommand } from "./channels/add.js";
export type { ChannelsCapabilitiesOptions } from "./channels/capabilities.js";
export { channelsCapabilitiesCommand } from "./channels/capabilities.js";
export type { ChannelsListOptions } from "./channels/list.js";
export { channelsListCommand } from "./channels/list.js";
export type { ChannelsLogsOptions } from "./channels/logs.js";
export { channelsLogsCommand } from "./channels/logs.js";
export type { ChannelsRemoveOptions } from "./channels/remove.js";
export { channelsRemoveCommand } from "./channels/remove.js";
export type { ChannelsResolveOptions } from "./channels/resolve.js";
export { channelsResolveCommand } from "./channels/resolve.js";
export type { ChannelsStatusOptions } from "./channels/status.js";
export { channelsStatusCommand, formatGatewayChannelsStatusLines } from "./channels/status.js";
