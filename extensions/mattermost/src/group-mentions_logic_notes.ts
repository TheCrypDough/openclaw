/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/group-mentions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelGroupContext } from "openclaw/plugin-sdk";
import { resolveMattermostAccount } from "./mattermost/accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMattermostGroupRequireMention(
  params: ChannelGroupContext,
): boolean | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveMattermostAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (typeof account.requireMention === "boolean") {
    return account.requireMention;
  }
  return true;
}
