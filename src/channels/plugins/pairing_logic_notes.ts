/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/pairing.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
import {
  type ChannelId,
  getChannelPlugin,
  listChannelPlugins,
  normalizeChannelId,
} from "./index.js";
import type { ChannelPairingAdapter } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listPairingChannels(): ChannelId[] {
  // Channel docking: pairing support is declared via plugin.pairing.
  return listChannelPlugins()
    .filter((plugin) => plugin.pairing)
    .map((plugin) => plugin.id);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getPairingAdapter(channelId: ChannelId): ChannelPairingAdapter | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(channelId);
  return plugin?.pairing ?? null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requirePairingAdapter(channelId: ChannelId): ChannelPairingAdapter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const adapter = getPairingAdapter(channelId);
  if (!adapter) {
    throw new Error(`Channel ${channelId} does not support pairing`);
  }
  return adapter;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePairingChannel(raw: unknown): ChannelId {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = (
    typeof raw === "string"
      ? raw
      : typeof raw === "number" || typeof raw === "boolean"
        ? String(raw)
        : ""
  )
    .trim()
    .toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeChannelId(value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channels = listPairingChannels();
  if (!normalized || !channels.includes(normalized)) {
    throw new Error(
      `Invalid channel: ${value || "(empty)"} (expected one of: ${channels.join(", ")})`,
    );
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function notifyPairingApproved(params: {
  channelId: ChannelId;
  id: string;
  cfg: OpenClawConfig;
  runtime?: RuntimeEnv;
  /** Extension channels can pass their adapter directly to bypass registry lookup. */
  pairingAdapter?: ChannelPairingAdapter;
}): Promise<void> {
  // Extensions may provide adapter directly to bypass ESM module isolation
  const adapter = params.pairingAdapter ?? requirePairingAdapter(params.channelId);
  if (!adapter.notifyApproval) {
    return;
  }
  await adapter.notifyApproval({
    cfg: params.cfg,
    id: params.id,
    runtime: params.runtime,
  });
}
