/*
 * AUTO ANNOTATION
 * File: src/telegram/group-migration.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { TelegramGroupConfig } from "../config/types.telegram.js";
import { normalizeAccountId } from "../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TelegramGroups = Record<string, TelegramGroupConfig>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MigrationScope = "account" | "global";

export type TelegramGroupMigrationResult = {
  migrated: boolean;
  skippedExisting: boolean;
  scopes: MigrationScope[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountGroups(
  cfg: OpenClawConfig,
  accountId?: string | null,
): { groups?: TelegramGroups } {
  if (!accountId) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeAccountId(accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.telegram?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exact = accounts[normalized];
  if (exact?.groups) {
    return { groups: exact.groups };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey = Object.keys(accounts).find(
    (key) => key.toLowerCase() === normalized.toLowerCase(),
  );
  return { groups: matchKey ? accounts[matchKey]?.groups : undefined };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function migrateTelegramGroupsInPlace(
  groups: TelegramGroups | undefined,
  oldChatId: string,
  newChatId: string,
): { migrated: boolean; skippedExisting: boolean } {
  if (!groups) {
    return { migrated: false, skippedExisting: false };
  }
  if (oldChatId === newChatId) {
    return { migrated: false, skippedExisting: false };
  }
  if (!Object.hasOwn(groups, oldChatId)) {
    return { migrated: false, skippedExisting: false };
  }
  if (Object.hasOwn(groups, newChatId)) {
    return { migrated: false, skippedExisting: true };
  }
  groups[newChatId] = groups[oldChatId];
  delete groups[oldChatId];
  return { migrated: true, skippedExisting: false };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function migrateTelegramGroupConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  oldChatId: string;
  newChatId: string;
}): TelegramGroupMigrationResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopes: MigrationScope[] = [];
  let migrated = false;
  let skippedExisting = false;

  const migrationTargets: Array<{
    scope: MigrationScope;
    groups: TelegramGroups | undefined;
  }> = [
    { scope: "account", groups: resolveAccountGroups(params.cfg, params.accountId).groups },
    { scope: "global", groups: params.cfg.channels?.telegram?.groups },
  ];

  for (const target of migrationTargets) {
    const result = migrateTelegramGroupsInPlace(target.groups, params.oldChatId, params.newChatId);
    if (result.migrated) {
      migrated = true;
      scopes.push(target.scope);
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }

  return { migrated, skippedExisting, scopes };
}
