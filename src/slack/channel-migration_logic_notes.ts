/*
 * AUTO ANNOTATION
 * File: src/slack/channel-migration.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { SlackChannelConfig } from "../config/types.slack.js";
import { normalizeAccountId } from "../routing/session-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackChannels = Record<string, SlackChannelConfig>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MigrationScope = "account" | "global";

export type SlackChannelMigrationResult = {
  migrated: boolean;
  skippedExisting: boolean;
  scopes: MigrationScope[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountChannels(
  cfg: OpenClawConfig,
  accountId?: string | null,
): { channels?: SlackChannels } {
  if (!accountId) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeAccountId(accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.channels?.slack?.accounts;
  if (!accounts || typeof accounts !== "object") {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exact = accounts[normalized];
  if (exact?.channels) {
    return { channels: exact.channels };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey = Object.keys(accounts).find(
    (key) => key.toLowerCase() === normalized.toLowerCase(),
  );
  return { channels: matchKey ? accounts[matchKey]?.channels : undefined };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function migrateSlackChannelsInPlace(
  channels: SlackChannels | undefined,
  oldChannelId: string,
  newChannelId: string,
): { migrated: boolean; skippedExisting: boolean } {
  if (!channels) {
    return { migrated: false, skippedExisting: false };
  }
  if (oldChannelId === newChannelId) {
    return { migrated: false, skippedExisting: false };
  }
  if (!Object.hasOwn(channels, oldChannelId)) {
    return { migrated: false, skippedExisting: false };
  }
  if (Object.hasOwn(channels, newChannelId)) {
    return { migrated: false, skippedExisting: true };
  }
  channels[newChannelId] = channels[oldChannelId];
  delete channels[oldChannelId];
  return { migrated: true, skippedExisting: false };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function migrateSlackChannelConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  oldChannelId: string;
  newChannelId: string;
}): SlackChannelMigrationResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopes: MigrationScope[] = [];
  let migrated = false;
  let skippedExisting = false;

  const accountChannels = resolveAccountChannels(params.cfg, params.accountId).channels;
  if (accountChannels) {
    const result = migrateSlackChannelsInPlace(
      accountChannels,
      params.oldChannelId,
      params.newChannelId,
    );
    if (result.migrated) {
      migrated = true;
      scopes.push("account");
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }

  const globalChannels = params.cfg.channels?.slack?.channels;
  if (globalChannels) {
    const result = migrateSlackChannelsInPlace(
      globalChannels,
      params.oldChannelId,
      params.newChannelId,
    );
    if (result.migrated) {
      migrated = true;
      scopes.push("global");
    }
    if (result.skippedExisting) {
      skippedExisting = true;
    }
  }

  return { migrated, skippedExisting, scopes };
}
