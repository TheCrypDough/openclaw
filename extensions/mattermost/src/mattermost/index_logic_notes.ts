/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export {
  listEnabledMattermostAccounts,
  listMattermostAccountIds,
  resolveDefaultMattermostAccountId,
  resolveMattermostAccount,
} from "./accounts.js";
export { monitorMattermostProvider } from "./monitor.js";
export { probeMattermost } from "./probe.js";
export { sendMessageMattermost } from "./send.js";
