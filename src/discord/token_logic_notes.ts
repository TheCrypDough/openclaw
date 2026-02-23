/*
 * AUTO ANNOTATION
 * File: src/discord/token.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseTokenResolution } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";

export type DiscordTokenSource = "env" | "config" | "none";

export type DiscordTokenResolution = BaseTokenResolution & {
  source: DiscordTokenSource;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDiscordToken(raw?: string | null): string | undefined {
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/^Bot\s+/i, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordToken(
  cfg?: OpenClawConfig,
  opts: { accountId?: string | null; envToken?: string | null } = {},
): DiscordTokenResolution {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = normalizeAccountId(opts.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const discordCfg = cfg?.channels?.discord;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountCfg =
    accountId !== DEFAULT_ACCOUNT_ID
      ? discordCfg?.accounts?.[accountId]
      : discordCfg?.accounts?.[DEFAULT_ACCOUNT_ID];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountToken = normalizeDiscordToken(accountCfg?.token ?? undefined);
  if (accountToken) {
    return { token: accountToken, source: "config" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configToken = allowEnv ? normalizeDiscordToken(discordCfg?.token ?? undefined) : undefined;
  if (configToken) {
    return { token: configToken, source: "config" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envToken = allowEnv
    ? normalizeDiscordToken(opts.envToken ?? process.env.DISCORD_BOT_TOKEN)
    : undefined;
  if (envToken) {
    return { token: envToken, source: "env" };
  }

  return { token: "", source: "none" };
}
