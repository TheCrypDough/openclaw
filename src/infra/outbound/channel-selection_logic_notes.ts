/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/channel-selection.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listChannelPlugins } from "../../channels/plugins/index.js";
import type { ChannelPlugin } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import {
  listDeliverableMessageChannels,
  type DeliverableMessageChannel,
  normalizeMessageChannel,
} from "../../utils/message-channel.js";

export type MessageChannelId = DeliverableMessageChannel;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getMessageChannels = () => listDeliverableMessageChannels();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isKnownChannel(value: string): boolean {
  return getMessageChannels().includes(value as MessageChannelId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isAccountEnabled(account: unknown): boolean {
  if (!account || typeof account !== "object") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enabled = (account as { enabled?: boolean }).enabled;
  return enabled !== false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function isPluginConfigured(plugin: ChannelPlugin, cfg: OpenClawConfig): Promise<boolean> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountIds = plugin.config.listAccountIds(cfg);
  if (accountIds.length === 0) {
    return false;
  }

  for (const accountId of accountIds) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = plugin.config.resolveAccount(cfg, accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enabled = plugin.config.isEnabled
      ? plugin.config.isEnabled(account, cfg)
      : isAccountEnabled(account);
    if (!enabled) {
      continue;
    }
    if (!plugin.config.isConfigured) {
      return true;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configured = await plugin.config.isConfigured(account, cfg);
    if (configured) {
      return true;
    }
  }

  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listConfiguredMessageChannels(
  cfg: OpenClawConfig,
): Promise<MessageChannelId[]> {
  const channels: MessageChannelId[] = [];
  for (const plugin of listChannelPlugins()) {
    if (!isKnownChannel(plugin.id)) {
      continue;
    }
    if (await isPluginConfigured(plugin, cfg)) {
      channels.push(plugin.id);
    }
  }
  return channels;
}

export async function resolveMessageChannelSelection(params: {
  cfg: OpenClawConfig;
  channel?: string | null;
}): Promise<{ channel: MessageChannelId; configured: MessageChannelId[] }> {
  const normalized = normalizeMessageChannel(params.channel);
  if (normalized) {
    if (!isKnownChannel(normalized)) {
      throw new Error(`Unknown channel: ${String(normalized)}`);
    }
    return {
      channel: normalized as MessageChannelId,
      configured: await listConfiguredMessageChannels(params.cfg),
    };
  }

  const configured = await listConfiguredMessageChannels(params.cfg);
  if (configured.length === 1) {
    return { channel: configured[0], configured };
  }
  if (configured.length === 0) {
    throw new Error("Channel is required (no configured channels detected).");
  }
  throw new Error(
    `Channel is required when multiple channels are configured: ${configured.join(", ")}`,
  );
}
