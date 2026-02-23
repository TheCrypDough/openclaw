/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { monitorMSTeamsProvider } from "./monitor.js";
export { probeMSTeams } from "./probe.js";
export { sendMessageMSTeams, sendPollMSTeams } from "./send.js";
export { type MSTeamsCredentials, resolveMSTeamsCredentials } from "./token.js";
