/*
 * AUTO ANNOTATION
 * File: src/infra/channel-activity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelId } from "../channels/plugins/types.js";
export type ChannelDirection = "inbound" | "outbound";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ActivityEntry = {
  inboundAt: number | null;
  outboundAt: number | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const activity = new Map<string, ActivityEntry>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function keyFor(channel: ChannelId, accountId: string) {
  return `${channel}:${accountId || "default"}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function ensureEntry(channel: ChannelId, accountId: string): ActivityEntry {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = keyFor(channel, accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = activity.get(key);
  if (existing) {
    return existing;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const created: ActivityEntry = { inboundAt: null, outboundAt: null };
  activity.set(key, created);
  return created;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function recordChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
  direction: ChannelDirection;
  at?: number;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const at = typeof params.at === "number" ? params.at : Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = params.accountId?.trim() || "default";
  const entry = ensureEntry(params.channel, accountId);
  if (params.direction === "inbound") {
    entry.inboundAt = at;
  }
  if (params.direction === "outbound") {
    entry.outboundAt = at;
  }
}

export function getChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
}): ActivityEntry {
  const accountId = params.accountId?.trim() || "default";
  return (
    activity.get(keyFor(params.channel, accountId)) ?? {
      inboundAt: null,
      outboundAt: null,
    }
  );
}

export function resetChannelActivityForTest() {
  activity.clear();
}
