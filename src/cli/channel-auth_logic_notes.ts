/*
 * AUTO ANNOTATION
 * File: src/cli/channel-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveChannelDefaultAccountId } from "../channels/plugins/helpers.js";
import { getChannelPlugin, normalizeChannelId } from "../channels/plugins/index.js";
import { DEFAULT_CHAT_CHANNEL } from "../channels/registry.js";
import { loadConfig } from "../config/config.js";
import { setVerbose } from "../globals.js";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ChannelAuthOptions = {
  channel?: string;
  account?: string;
  verbose?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runChannelLogin(
  opts: ChannelAuthOptions,
  runtime: RuntimeEnv = defaultRuntime,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelInput = opts.channel ?? DEFAULT_CHAT_CHANNEL;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelId = normalizeChannelId(channelInput);
  if (!channelId) {
    throw new Error(`Unsupported channel: ${channelInput}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(channelId);
  if (!plugin?.auth?.login) {
    throw new Error(`Channel ${channelId} does not support login`);
  }
  // Auth-only flow: do not mutate channel config here.
  setVerbose(Boolean(opts.verbose));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = opts.account?.trim() || resolveChannelDefaultAccountId({ plugin, cfg });
  await plugin.auth.login({
    cfg,
    accountId,
    runtime,
    verbose: Boolean(opts.verbose),
    channelInput,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runChannelLogout(
  opts: ChannelAuthOptions,
  runtime: RuntimeEnv = defaultRuntime,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelInput = opts.channel ?? DEFAULT_CHAT_CHANNEL;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelId = normalizeChannelId(channelInput);
  if (!channelId) {
    throw new Error(`Unsupported channel: ${channelInput}`);
  }
  const plugin = getChannelPlugin(channelId);
  if (!plugin?.gateway?.logoutAccount) {
    throw new Error(`Channel ${channelId} does not support logout`);
  }
  // Auth-only flow: resolve account + clear session state only.
  const cfg = loadConfig();
  const accountId = opts.account?.trim() || resolveChannelDefaultAccountId({ plugin, cfg });
  const account = plugin.config.resolveAccount(cfg, accountId);
  await plugin.gateway.logoutAccount({
    cfg,
    accountId,
    account,
    runtime,
  });
}
