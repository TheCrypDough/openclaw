# AUTOPLACEHOLDER_ANNOTATION: src/plugin-sdk/config-paths.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveChannelAccountConfigBasePath(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channels = params.cfg.channels as unknown as Record<string, unknown> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelSection = channels?.[params.channelKey] as Record<string, unknown> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = channelSection?.accounts as Record<string, unknown> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const useAccountPath = Boolean(accounts?.[params.accountId]);
  return useAccountPath
    ? `channels.${params.channelKey}.accounts.${params.accountId}.`
    : `channels.${params.channelKey}.`;
}
