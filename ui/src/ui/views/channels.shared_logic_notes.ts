/*
 * AUTO ANNOTATION
 * File: ui/src/ui/views/channels.shared.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { html, nothing } from "lit";
import type { ChannelAccountSnapshot } from "../types.ts";
import type { ChannelKey, ChannelsProps } from "./channels.types.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function channelEnabled(key: ChannelKey, props: ChannelsProps) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = props.snapshot;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channels = snapshot?.channels as Record<string, unknown> | null;
  if (!snapshot || !channels) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelStatus = channels[key] as Record<string, unknown> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configured = typeof channelStatus?.configured === "boolean" && channelStatus.configured;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const running = typeof channelStatus?.running === "boolean" && channelStatus.running;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const connected = typeof channelStatus?.connected === "boolean" && channelStatus.connected;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = snapshot.channelAccounts?.[key] ?? [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountActive = accounts.some(
    (account) => account.configured || account.running || account.connected,
  );
  return configured || running || connected || accountActive;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getChannelAccountCount(
  key: ChannelKey,
  channelAccounts?: Record<string, ChannelAccountSnapshot[]> | null,
): number {
  return channelAccounts?.[key]?.length ?? 0;
}

export function renderChannelAccountCount(
  key: ChannelKey,
  channelAccounts?: Record<string, ChannelAccountSnapshot[]> | null,
) {
  const count = getChannelAccountCount(key, channelAccounts);
  if (count < 2) {
    return nothing;
  }
  return html`<div class="account-count">Accounts (${count})</div>`;
}
