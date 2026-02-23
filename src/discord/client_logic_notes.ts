/*
 * AUTO ANNOTATION
 * File: src/discord/client.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { RequestClient } from "@buape/carbon";
import { loadConfig } from "../config/config.js";
import { createDiscordRetryRunner, type RetryRunner } from "../infra/retry-policy.js";
import type { RetryConfig } from "../infra/retry.js";
import { resolveDiscordAccount } from "./accounts.js";
import { normalizeDiscordToken } from "./token.js";

export type DiscordClientOpts = {
  token?: string;
  accountId?: string;
  rest?: RequestClient;
  retry?: RetryConfig;
  verbose?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveToken(params: { explicit?: string; accountId: string; fallbackToken?: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit = normalizeDiscordToken(params.explicit);
  if (explicit) {
    return explicit;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallback = normalizeDiscordToken(params.fallbackToken);
  if (!fallback) {
    throw new Error(
      `Discord bot token missing for account "${params.accountId}" (set discord.accounts.${params.accountId}.token or DISCORD_BOT_TOKEN for default).`,
    );
  }
  return fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveRest(token: string, rest?: RequestClient) {
  return rest ?? new RequestClient(token);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDiscordRestClient(opts: DiscordClientOpts, cfg = loadConfig()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveDiscordAccount({ cfg, accountId: opts.accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = resolveToken({
    explicit: opts.token,
    accountId: account.accountId,
    fallbackToken: account.token,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = resolveRest(token, opts.rest);
  return { token, rest, account };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDiscordClient(
  opts: DiscordClientOpts,
  cfg = loadConfig(),
): { token: string; rest: RequestClient; request: RetryRunner } {
  const { token, rest, account } = createDiscordRestClient(opts, cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const request = createDiscordRetryRunner({
    retry: opts.retry,
    configRetry: account.config.retry,
    verbose: opts.verbose,
  });
  return { token, rest, request };
}

export function resolveDiscordRest(opts: DiscordClientOpts) {
  return createDiscordRestClient(opts).rest;
}
