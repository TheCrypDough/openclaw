/*
 * AUTO ANNOTATION
 * File: extensions/googlechat/src/accounts.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import type { GoogleChatAccountConfig } from "./types.config.js";

export type GoogleChatCredentialSource = "file" | "inline" | "env" | "none";

export type ResolvedGoogleChatAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  config: GoogleChatAccountConfig;
  credentialSource: GoogleChatCredentialSource;
  credentials?: Record<string, unknown>;
  credentialsFile?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listConfiguredAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.["googlechat"]?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listGoogleChatAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted((a, b) => a.localeCompare(b));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDefaultGoogleChatAccountId(cfg: OpenClawConfig): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channel = cfg.channels?.["googlechat"];
  if (channel?.defaultAccount?.trim()) {
    return channel.defaultAccount.trim();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = listGoogleChatAccountIds(cfg);
  if (ids.includes(DEFAULT_ACCOUNT_ID)) {
    return DEFAULT_ACCOUNT_ID;
  }
  return ids[0] ?? DEFAULT_ACCOUNT_ID;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountConfig(
  cfg: OpenClawConfig,
  accountId: string,
): GoogleChatAccountConfig | undefined {
  const accounts = cfg.channels?.["googlechat"]?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId];
}

function mergeGoogleChatAccountConfig(
  cfg: OpenClawConfig,
  accountId: string,
): GoogleChatAccountConfig {
  const raw = cfg.channels?.["googlechat"] ?? {};
  const { accounts: _ignored, defaultAccount: _ignored2, ...base } = raw;
  const account = resolveAccountConfig(cfg, accountId) ?? {};
  return { ...base, ...account } as GoogleChatAccountConfig;
}

function parseServiceAccount(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function resolveCredentialsFromConfig(params: {
  accountId: string;
  account: GoogleChatAccountConfig;
}): {
  credentials?: Record<string, unknown>;
  credentialsFile?: string;
  source: GoogleChatCredentialSource;
} {
  const { account, accountId } = params;
  const inline = parseServiceAccount(account.serviceAccount);
  if (inline) {
    return { credentials: inline, source: "inline" };
  }

  const file = account.serviceAccountFile?.trim();
  if (file) {
    return { credentialsFile: file, source: "file" };
  }

  if (accountId === DEFAULT_ACCOUNT_ID) {
    const envJson = process.env[ENV_SERVICE_ACCOUNT];
    const envInline = parseServiceAccount(envJson);
    if (envInline) {
      return { credentials: envInline, source: "env" };
    }
    const envFile = process.env[ENV_SERVICE_ACCOUNT_FILE]?.trim();
    if (envFile) {
      return { credentialsFile: envFile, source: "env" };
    }
  }

  return { source: "none" };
}

export function resolveGoogleChatAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedGoogleChatAccount {
  const accountId = normalizeAccountId(params.accountId);
  const baseEnabled = params.cfg.channels?.["googlechat"]?.enabled !== false;
  const merged = mergeGoogleChatAccountConfig(params.cfg, accountId);
  const accountEnabled = merged.enabled !== false;
  const enabled = baseEnabled && accountEnabled;
  const credentials = resolveCredentialsFromConfig({ accountId, account: merged });

  return {
    accountId,
    name: merged.name?.trim() || undefined,
    enabled,
    config: merged,
    credentialSource: credentials.source,
    credentials: credentials.credentials,
    credentialsFile: credentials.credentialsFile,
  };
}

export function listEnabledGoogleChatAccounts(cfg: OpenClawConfig): ResolvedGoogleChatAccount[] {
  return listGoogleChatAccountIds(cfg)
    .map((accountId) => resolveGoogleChatAccount({ cfg, accountId }))
    .filter((account) => account.enabled);
}
