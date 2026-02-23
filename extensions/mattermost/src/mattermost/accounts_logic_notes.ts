/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/accounts.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import type { MattermostAccountConfig, MattermostChatMode } from "../types.js";
import { normalizeMattermostBaseUrl } from "./client.js";

export type MattermostTokenSource = "env" | "config" | "none";
export type MattermostBaseUrlSource = "env" | "config" | "none";

export type ResolvedMattermostAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  botToken?: string;
  baseUrl?: string;
  botTokenSource: MattermostTokenSource;
  baseUrlSource: MattermostBaseUrlSource;
  config: MattermostAccountConfig;
  chatmode?: MattermostChatMode;
  oncharPrefixes?: string[];
  requireMention?: boolean;
  textChunkLimit?: number;
  blockStreaming?: boolean;
  blockStreamingCoalesce?: MattermostAccountConfig["blockStreamingCoalesce"];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listConfiguredAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.mattermost?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listMattermostAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted((a, b) => a.localeCompare(b));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDefaultMattermostAccountId(cfg: OpenClawConfig): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = listMattermostAccountIds(cfg);
  if (ids.includes(DEFAULT_ACCOUNT_ID)) {
    return DEFAULT_ACCOUNT_ID;
  }
  return ids[0] ?? DEFAULT_ACCOUNT_ID;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountConfig(
  cfg: OpenClawConfig,
  accountId: string,
): MattermostAccountConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.mattermost?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId] as MattermostAccountConfig | undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mergeMattermostAccountConfig(
  cfg: OpenClawConfig,
  accountId: string,
): MattermostAccountConfig {
  const { accounts: _ignored, ...base } = (cfg.channels?.mattermost ??
    {}) as MattermostAccountConfig & { accounts?: unknown };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveAccountConfig(cfg, accountId) ?? {};
  return { ...base, ...account };
}

function resolveMattermostRequireMention(config: MattermostAccountConfig): boolean | undefined {
  if (config.chatmode === "oncall") {
    return true;
  }
  if (config.chatmode === "onmessage") {
    return false;
  }
  if (config.chatmode === "onchar") {
    return true;
  }
  return config.requireMention;
}

export function resolveMattermostAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedMattermostAccount {
  const accountId = normalizeAccountId(params.accountId);
  const baseEnabled = params.cfg.channels?.mattermost?.enabled !== false;
  const merged = mergeMattermostAccountConfig(params.cfg, accountId);
  const accountEnabled = merged.enabled !== false;
  const enabled = baseEnabled && accountEnabled;

  const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
  const envToken = allowEnv ? process.env.MATTERMOST_BOT_TOKEN?.trim() : undefined;
  const envUrl = allowEnv ? process.env.MATTERMOST_URL?.trim() : undefined;
  const configToken = merged.botToken?.trim();
  const configUrl = merged.baseUrl?.trim();
  const botToken = configToken || envToken;
  const baseUrl = normalizeMattermostBaseUrl(configUrl || envUrl);
  const requireMention = resolveMattermostRequireMention(merged);

  const botTokenSource: MattermostTokenSource = configToken ? "config" : envToken ? "env" : "none";
  const baseUrlSource: MattermostBaseUrlSource = configUrl ? "config" : envUrl ? "env" : "none";

  return {
    accountId,
    enabled,
    name: merged.name?.trim() || undefined,
    botToken,
    baseUrl,
    botTokenSource,
    baseUrlSource,
    config: merged,
    chatmode: merged.chatmode,
    oncharPrefixes: merged.oncharPrefixes,
    requireMention,
    textChunkLimit: merged.textChunkLimit,
    blockStreaming: merged.blockStreaming,
    blockStreamingCoalesce: merged.blockStreamingCoalesce,
  };
}

export function listEnabledMattermostAccounts(cfg: OpenClawConfig): ResolvedMattermostAccount[] {
  return listMattermostAccountIds(cfg)
    .map((accountId) => resolveMattermostAccount({ cfg, accountId }))
    .filter((account) => account.enabled);
}
