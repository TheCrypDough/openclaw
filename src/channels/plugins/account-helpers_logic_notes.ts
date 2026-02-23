/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/account-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import { DEFAULT_ACCOUNT_ID } from "../../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createAccountListHelpers(channelKey: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function listConfiguredAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channel = cfg.channels?.[channelKey];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accounts = (channel as Record<string, unknown> | undefined)?.accounts;
    if (!accounts || typeof accounts !== "object") {
      return [];
    }
    return Object.keys(accounts as Record<string, unknown>).filter(Boolean);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function listAccountIds(cfg: OpenClawConfig): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
      return [DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted((a, b) => a.localeCompare(b));
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function resolveDefaultAccountId(cfg: OpenClawConfig): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ids = listAccountIds(cfg);
    if (ids.includes(DEFAULT_ACCOUNT_ID)) {
      return DEFAULT_ACCOUNT_ID;
    }
    return ids[0] ?? DEFAULT_ACCOUNT_ID;
  }

  return { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId };
}
