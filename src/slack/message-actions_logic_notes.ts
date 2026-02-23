/*
 * AUTO ANNOTATION
 * File: src/slack/message-actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createActionGate } from "../agents/tools/common.js";
import type { ChannelMessageActionName, ChannelToolSend } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { listEnabledSlackAccounts } from "./accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listSlackMessageActions(cfg: OpenClawConfig): ChannelMessageActionName[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = listEnabledSlackAccounts(cfg).filter(
    (account) => account.botTokenSource !== "none",
  );
  if (accounts.length === 0) {
    return [];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isActionEnabled = (key: string, defaultValue = true) => {
    for (const account of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const gate = createActionGate(
        (account.actions ?? cfg.channels?.slack?.actions) as Record<string, boolean | undefined>,
      );
      if (gate(key, defaultValue)) {
        return true;
      }
    }
    return false;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actions = new Set<ChannelMessageActionName>(["send"]);
  if (isActionEnabled("reactions")) {
    actions.add("react");
    actions.add("reactions");
  }
  if (isActionEnabled("messages")) {
    actions.add("read");
    actions.add("edit");
    actions.add("delete");
  }
  if (isActionEnabled("pins")) {
    actions.add("pin");
    actions.add("unpin");
    actions.add("list-pins");
  }
  if (isActionEnabled("memberInfo")) {
    actions.add("member-info");
  }
  if (isActionEnabled("emojiList")) {
    actions.add("emoji-list");
  }
  return Array.from(actions);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractSlackToolSend(args: Record<string, unknown>): ChannelToolSend | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = typeof args.action === "string" ? args.action.trim() : "";
  if (action !== "sendMessage") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const to = typeof args.to === "string" ? args.to : undefined;
  if (!to) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
  return { to, accountId };
}
