/*
 * AUTO ANNOTATION
 * File: src/discord/audit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { DiscordGuildChannelConfig, DiscordGuildEntry } from "../config/types.js";
import { isRecord } from "../utils.js";
import { resolveDiscordAccount } from "./accounts.js";
import { fetchChannelPermissionsDiscord } from "./send.js";

export type DiscordChannelPermissionsAuditEntry = {
  channelId: string;
  ok: boolean;
  missing?: string[];
  error?: string | null;
  matchKey?: string;
  matchSource?: "id";
};

export type DiscordChannelPermissionsAudit = {
  ok: boolean;
  checkedChannels: number;
  unresolvedChannels: number;
  channels: DiscordChannelPermissionsAuditEntry[];
  elapsedMs: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const REQUIRED_CHANNEL_PERMISSIONS = ["ViewChannel", "SendMessages"] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldAuditChannelConfig(config: DiscordGuildChannelConfig | undefined) {
  if (!config) {
    return true;
  }
  if (config.allow === false) {
    return false;
  }
  if (config.enabled === false) {
    return false;
  }
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listConfiguredGuildChannelKeys(
  guilds: Record<string, DiscordGuildEntry> | undefined,
): string[] {
  if (!guilds) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = new Set<string>();
  for (const entry of Object.values(guilds)) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelsRaw = (entry as { channels?: unknown }).channels;
    if (!isRecord(channelsRaw)) {
      continue;
    }
    for (const [key, value] of Object.entries(channelsRaw)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelId = String(key).trim();
      if (!channelId) {
        continue;
      }
      if (!shouldAuditChannelConfig(value as DiscordGuildChannelConfig | undefined)) {
        continue;
      }
      ids.add(channelId);
    }
  }
  return [...ids].toSorted((a, b) => a.localeCompare(b));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveDiscordAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keys = listConfiguredGuildChannelKeys(account.config.guilds);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelIds = keys.filter((key) => /^\d+$/.test(key));
  const unresolvedChannels = keys.length - channelIds.length;
  return { channelIds, unresolvedChannels };
}

export async function auditDiscordChannelPermissions(params: {
  token: string;
  accountId?: string | null;
  channelIds: string[];
  timeoutMs: number;
}): Promise<DiscordChannelPermissionsAudit> {
  const started = Date.now();
  const token = params.token?.trim() ?? "";
  if (!token || params.channelIds.length === 0) {
    return {
      ok: true,
      checkedChannels: 0,
      unresolvedChannels: 0,
      channels: [],
      elapsedMs: Date.now() - started,
    };
  }

  const required = [...REQUIRED_CHANNEL_PERMISSIONS];
  const channels: DiscordChannelPermissionsAuditEntry[] = [];

  for (const channelId of params.channelIds) {
    try {
      const perms = await fetchChannelPermissionsDiscord(channelId, {
        token,
        accountId: params.accountId ?? undefined,
      });
      const missing = required.filter((p) => !perms.permissions.includes(p));
      channels.push({
        channelId,
        ok: missing.length === 0,
        missing: missing.length ? missing : undefined,
        error: null,
        matchKey: channelId,
        matchSource: "id",
      });
    } catch (err) {
      channels.push({
        channelId,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        matchKey: channelId,
        matchSource: "id",
      });
    }
  }

  return {
    ok: channels.every((c) => c.ok),
    checkedChannels: channels.length,
    unresolvedChannels: 0,
    channels,
    elapsedMs: Date.now() - started,
  };
}
