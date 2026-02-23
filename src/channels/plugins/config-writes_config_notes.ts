# AUTOPLACEHOLDER_ANNOTATION: src/channels/plugins/config-writes.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig } from "../../config/config.js";
import { normalizeAccountId } from "../../routing/session-key.js";
import type { ChannelId } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ChannelConfigWithAccounts = {
  configWrites?: boolean;
  accounts?: Record<string, { configWrites?: boolean }>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountConfig(accounts: ChannelConfigWithAccounts["accounts"], accountId: string) {
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  if (accountId in accounts) {
    return accounts[accountId];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey = Object.keys(accounts).find(
    (key) => key.toLowerCase() === accountId.toLowerCase(),
  );
  return matchKey ? accounts[matchKey] : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveChannelConfigWrites(params: {
  cfg: OpenClawConfig;
  channelId?: ChannelId | null;
  accountId?: string | null;
}): boolean {
  if (!params.channelId) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channels = params.cfg.channels as Record<string, ChannelConfigWithAccounts> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelConfig = channels?.[params.channelId];
  if (!channelConfig) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = normalizeAccountId(params.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountConfig = resolveAccountConfig(channelConfig.accounts, accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = accountConfig?.configWrites ?? channelConfig.configWrites;
  return value !== false;
}
