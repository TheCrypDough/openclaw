/*
 * AUTO ANNOTATION
 * File: src/signal/rpc-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../config/config.js";
import { resolveSignalAccount } from "./accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSignalRpcContext(
  opts: { baseUrl?: string; account?: string; accountId?: string },
  accountInfo?: ReturnType<typeof resolveSignalAccount>,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasBaseUrl = Boolean(opts.baseUrl?.trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasAccount = Boolean(opts.account?.trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedAccount =
    accountInfo ||
    (!hasBaseUrl || !hasAccount
      ? resolveSignalAccount({
          cfg: loadConfig(),
          accountId: opts.accountId,
        })
      : undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = opts.baseUrl?.trim() || resolvedAccount?.baseUrl;
  if (!baseUrl) {
    throw new Error("Signal base URL is required");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = opts.account?.trim() || resolvedAccount?.config.account?.trim();
  return { baseUrl, account };
}
