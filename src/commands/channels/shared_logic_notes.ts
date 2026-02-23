/*
 * AUTO ANNOTATION
 * File: src/commands/channels/shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { type ChannelId, getChannelPlugin } from "../../channels/plugins/index.js";
import type { OpenClawConfig } from "../../config/config.js";
import { DEFAULT_ACCOUNT_ID } from "../../routing/session-key.js";
import { defaultRuntime, type RuntimeEnv } from "../../runtime.js";
import { requireValidConfigSnapshot } from "../config-validation.js";

export type ChatChannel = ChannelId;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function requireValidConfig(
  runtime: RuntimeEnv = defaultRuntime,
): Promise<OpenClawConfig | null> {
  return await requireValidConfigSnapshot(runtime);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatAccountLabel(params: { accountId: string; name?: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = params.accountId || DEFAULT_ACCOUNT_ID;
  if (params.name?.trim()) {
    return `${base} (${params.name.trim()})`;
  }
  return base;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const channelLabel = (channel: ChatChannel) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(channel);
  return plugin?.meta.label ?? channel;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatChannelAccountLabel(params: {
  channel: ChatChannel;
  accountId: string;
  name?: string;
  channelStyle?: (value: string) => string;
  accountStyle?: (value: string) => string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelText = channelLabel(params.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountText = formatAccountLabel({
    accountId: params.accountId,
    name: params.name,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const styledChannel = params.channelStyle ? params.channelStyle(channelText) : channelText;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const styledAccount = params.accountStyle ? params.accountStyle(accountText) : accountText;
  return `${styledChannel} ${styledAccount}`;
}

export function shouldUseWizard(params?: { hasFlags?: boolean }) {
  return params?.hasFlags === false;
}
