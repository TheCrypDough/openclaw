/*
 * AUTO ANNOTATION
 * File: src/signal/accounts.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createAccountListHelpers } from "../channels/plugins/account-helpers.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SignalAccountConfig } from "../config/types.js";
import { normalizeAccountId } from "../routing/session-key.js";

export type ResolvedSignalAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  baseUrl: string;
  configured: boolean;
  config: SignalAccountConfig;
};

const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("signal");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const listSignalAccountIds = listAccountIds;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const resolveDefaultSignalAccountId = resolveDefaultAccountId;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountConfig(
  cfg: OpenClawConfig,
  accountId: string,
): SignalAccountConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.signal?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  return accounts[accountId] as SignalAccountConfig | undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mergeSignalAccountConfig(cfg: OpenClawConfig, accountId: string): SignalAccountConfig {
  const { accounts: _ignored, ...base } = (cfg.channels?.signal ?? {}) as SignalAccountConfig & {
    accounts?: unknown;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveAccountConfig(cfg, accountId) ?? {};
  return { ...base, ...account };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSignalAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedSignalAccount {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = normalizeAccountId(params.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseEnabled = params.cfg.channels?.signal?.enabled !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged = mergeSignalAccountConfig(params.cfg, accountId);
  const accountEnabled = merged.enabled !== false;
  const enabled = baseEnabled && accountEnabled;
  const host = merged.httpHost?.trim() || "127.0.0.1";
  const port = merged.httpPort ?? 8080;
  const baseUrl = merged.httpUrl?.trim() || `http://${host}:${port}`;
  const configured = Boolean(
    merged.account?.trim() ||
    merged.httpUrl?.trim() ||
    merged.cliPath?.trim() ||
    merged.httpHost?.trim() ||
    typeof merged.httpPort === "number" ||
    typeof merged.autoStart === "boolean",
  );
  return {
    accountId,
    enabled,
    name: merged.name?.trim() || undefined,
    baseUrl,
    configured,
    config: merged,
  };
}

export function listEnabledSignalAccounts(cfg: OpenClawConfig): ResolvedSignalAccount[] {
  return listSignalAccountIds(cfg)
    .map((accountId) => resolveSignalAccount({ cfg, accountId }))
    .filter((account) => account.enabled);
}
