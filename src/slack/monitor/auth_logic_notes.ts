/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readChannelAllowFromStore } from "../../pairing/pairing-store.js";
import { allowListMatches, normalizeAllowList, normalizeAllowListLower } from "./allow-list.js";
import type { SlackMonitorContext } from "./context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveSlackEffectiveAllowFrom(ctx: SlackMonitorContext) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeAllowFrom =
    ctx.dmPolicy === "allowlist" ? [] : await readChannelAllowFromStore("slack").catch(() => []);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowFrom = normalizeAllowList([...ctx.allowFrom, ...storeAllowFrom]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowFromLower = normalizeAllowListLower(allowFrom);
  return { allowFrom, allowFromLower };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isSlackSenderAllowListed(params: {
  allowListLower: string[];
  senderId: string;
  senderName?: string;
}) {
  const { allowListLower, senderId, senderName } = params;
  return (
    allowListLower.length === 0 ||
    allowListMatches({
      allowList: allowListLower,
      id: senderId,
      name: senderName,
    })
  );
}
