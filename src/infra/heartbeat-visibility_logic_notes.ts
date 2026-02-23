/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-visibility.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { ChannelHeartbeatVisibilityConfig } from "../config/types.channels.js";
import type { GatewayMessageChannel } from "../utils/message-channel.js";

export type ResolvedHeartbeatVisibility = {
  showOk: boolean;
  showAlerts: boolean;
  useIndicator: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_VISIBILITY: ResolvedHeartbeatVisibility = {
  showOk: false, // Silent by default
  showAlerts: true, // Show content messages
  useIndicator: true, // Emit indicator events
};

/**
 * Resolve heartbeat visibility settings for a channel.
 * Supports both deliverable channels (telegram, signal, etc.) and webchat.
 * For webchat, uses channels.defaults.heartbeat since webchat doesn't have per-channel config.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveHeartbeatVisibility(params: {
  cfg: OpenClawConfig;
  channel: GatewayMessageChannel;
  accountId?: string;
}): ResolvedHeartbeatVisibility {
  const { cfg, channel, accountId } = params;

  // Webchat uses channel defaults only (no per-channel or per-account config)
  if (channel === "webchat") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelDefaults = cfg.channels?.defaults?.heartbeat;
    return {
      showOk: channelDefaults?.showOk ?? DEFAULT_VISIBILITY.showOk,
      showAlerts: channelDefaults?.showAlerts ?? DEFAULT_VISIBILITY.showAlerts,
      useIndicator: channelDefaults?.useIndicator ?? DEFAULT_VISIBILITY.useIndicator,
    };
  }

  // Layer 1: Global channel defaults
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelDefaults = cfg.channels?.defaults?.heartbeat;

  // Layer 2: Per-channel config (at channel root level)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelCfg = cfg.channels?.[channel] as
    | {
        heartbeat?: ChannelHeartbeatVisibilityConfig;
        accounts?: Record<string, { heartbeat?: ChannelHeartbeatVisibilityConfig }>;
      }
    | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const perChannel = channelCfg?.heartbeat;

  // Layer 3: Per-account config (most specific)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountCfg = accountId ? channelCfg?.accounts?.[accountId] : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const perAccount = accountCfg?.heartbeat;

  // Precedence: per-account > per-channel > channel-defaults > global defaults
  return {
    showOk:
      perAccount?.showOk ??
      perChannel?.showOk ??
      channelDefaults?.showOk ??
      DEFAULT_VISIBILITY.showOk,
    showAlerts:
      perAccount?.showAlerts ??
      perChannel?.showAlerts ??
      channelDefaults?.showAlerts ??
      DEFAULT_VISIBILITY.showAlerts,
    useIndicator:
      perAccount?.useIndicator ??
      perChannel?.useIndicator ??
      channelDefaults?.useIndicator ??
      DEFAULT_VISIBILITY.useIndicator,
  };
}
