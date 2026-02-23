/*
 * AUTO ANNOTATION
 * File: src/discord/directory-live.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DirectoryConfigParams } from "../channels/plugins/directory-config.js";
import type { ChannelDirectoryEntry } from "../channels/plugins/types.js";
import { resolveDiscordAccount } from "./accounts.js";
import { fetchDiscord } from "./api.js";
import { normalizeDiscordSlug } from "./monitor/allow-list.js";
import { normalizeDiscordToken } from "./token.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordGuild = { id: string; name: string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordUser = { id: string; username: string; global_name?: string; bot?: boolean };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordMember = { user: DiscordUser; nick?: string | null };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordChannel = { id: string; name?: string | null };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeQuery(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildUserRank(user: DiscordUser): number {
  return user.bot ? 0 : 1;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listDiscordDirectoryGroupsLive(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveDiscordAccount({ cfg: params.cfg, accountId: params.accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = normalizeDiscordToken(account.token);
  if (!token) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const query = normalizeQuery(params.query);
  const rawGuilds = await fetchDiscord<DiscordGuild[]>("/users/@me/guilds", token);
  const guilds = rawGuilds.filter((g) => g.id && g.name);
  const rows: ChannelDirectoryEntry[] = [];

  for (const guild of guilds) {
    const channels = await fetchDiscord<DiscordChannel[]>(`/guilds/${guild.id}/channels`, token);
    for (const channel of channels) {
      const name = channel.name?.trim();
      if (!name) {
        continue;
      }
      if (query && !normalizeDiscordSlug(name).includes(normalizeDiscordSlug(query))) {
        continue;
      }
      rows.push({
        kind: "group",
        id: `channel:${channel.id}`,
        name,
        handle: `#${name}`,
        raw: channel,
      });
      if (typeof params.limit === "number" && params.limit > 0 && rows.length >= params.limit) {
        return rows;
      }
    }
  }

  return rows;
}

export async function listDiscordDirectoryPeersLive(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
  const account = resolveDiscordAccount({ cfg: params.cfg, accountId: params.accountId });
  const token = normalizeDiscordToken(account.token);
  if (!token) {
    return [];
  }
  const query = normalizeQuery(params.query);
  if (!query) {
    return [];
  }

  const rawGuilds = await fetchDiscord<DiscordGuild[]>("/users/@me/guilds", token);
  const guilds = rawGuilds.filter((g) => g.id && g.name);
  const rows: ChannelDirectoryEntry[] = [];
  const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 25;

  for (const guild of guilds) {
    const paramsObj = new URLSearchParams({
      query,
      limit: String(Math.min(limit, 100)),
    });
    const members = await fetchDiscord<DiscordMember[]>(
      `/guilds/${guild.id}/members/search?${paramsObj.toString()}`,
      token,
    );
    for (const member of members) {
      const user = member.user;
      if (!user?.id) {
        continue;
      }
      const name = member.nick?.trim() || user.global_name?.trim() || user.username?.trim();
      rows.push({
        kind: "user",
        id: `user:${user.id}`,
        name: name || undefined,
        handle: user.username ? `@${user.username}` : undefined,
        rank: buildUserRank(user),
        raw: member,
      });
      if (rows.length >= limit) {
        return rows;
      }
    }
  }

  return rows;
}
