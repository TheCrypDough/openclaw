/*
 * AUTO ANNOTATION
 * File: src/slack/directory-live.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DirectoryConfigParams } from "../channels/plugins/directory-config.js";
import type { ChannelDirectoryEntry } from "../channels/plugins/types.js";
import { resolveSlackAccount } from "./accounts.js";
import { createSlackWebClient } from "./client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackUser = {
  id?: string;
  name?: string;
  real_name?: string;
  is_bot?: boolean;
  is_app_user?: boolean;
  deleted?: boolean;
  profile?: {
    display_name?: string;
    real_name?: string;
    email?: string;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackChannel = {
  id?: string;
  name?: string;
  is_archived?: boolean;
  is_private?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackListUsersResponse = {
  members?: SlackUser[];
  response_metadata?: { next_cursor?: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackListChannelsResponse = {
  channels?: SlackChannel[];
  response_metadata?: { next_cursor?: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveReadToken(params: DirectoryConfigParams): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveSlackAccount({ cfg: params.cfg, accountId: params.accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userToken = account.config.userToken?.trim() || undefined;
  return userToken ?? account.botToken?.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeQuery(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildUserRank(user: SlackUser): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let rank = 0;
  if (!user.deleted) {
    rank += 2;
  }
  if (!user.is_bot && !user.is_app_user) {
    rank += 1;
  }
  return rank;
}

function buildChannelRank(channel: SlackChannel): number {
  return channel.is_archived ? 0 : 1;
}

export async function listSlackDirectoryPeersLive(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
  const token = resolveReadToken(params);
  if (!token) {
    return [];
  }
  const client = createSlackWebClient(token);
  const query = normalizeQuery(params.query);
  const members: SlackUser[] = [];
  let cursor: string | undefined;

  do {
    const res = (await client.users.list({
      limit: 200,
      cursor,
    })) as SlackListUsersResponse;
    if (Array.isArray(res.members)) {
      members.push(...res.members);
    }
    const next = res.response_metadata?.next_cursor?.trim();
    cursor = next ? next : undefined;
  } while (cursor);

  const filtered = members.filter((member) => {
    const name = member.profile?.display_name || member.profile?.real_name || member.real_name;
    const handle = member.name;
    const email = member.profile?.email;
    const candidates = [name, handle, email]
      .map((item) => item?.trim().toLowerCase())
      .filter(Boolean);
    if (!query) {
      return true;
    }
    return candidates.some((candidate) => candidate?.includes(query));
  });

  const rows = filtered
    .map((member) => {
      const id = member.id?.trim();
      if (!id) {
        return null;
      }
      const handle = member.name?.trim();
      const display =
        member.profile?.display_name?.trim() ||
        member.profile?.real_name?.trim() ||
        member.real_name?.trim() ||
        handle;
      return {
        kind: "user",
        id: `user:${id}`,
        name: display || undefined,
        handle: handle ? `@${handle}` : undefined,
        rank: buildUserRank(member),
        raw: member,
      } satisfies ChannelDirectoryEntry;
    })
    .filter(Boolean) as ChannelDirectoryEntry[];

  if (typeof params.limit === "number" && params.limit > 0) {
    return rows.slice(0, params.limit);
  }
  return rows;
}

export async function listSlackDirectoryGroupsLive(
  params: DirectoryConfigParams,
): Promise<ChannelDirectoryEntry[]> {
  const token = resolveReadToken(params);
  if (!token) {
    return [];
  }
  const client = createSlackWebClient(token);
  const query = normalizeQuery(params.query);
  const channels: SlackChannel[] = [];
  let cursor: string | undefined;

  do {
    const res = (await client.conversations.list({
      types: "public_channel,private_channel",
      exclude_archived: false,
      limit: 1000,
      cursor,
    })) as SlackListChannelsResponse;
    if (Array.isArray(res.channels)) {
      channels.push(...res.channels);
    }
    const next = res.response_metadata?.next_cursor?.trim();
    cursor = next ? next : undefined;
  } while (cursor);

  const filtered = channels.filter((channel) => {
    const name = channel.name?.trim().toLowerCase();
    if (!query) {
      return true;
    }
    return Boolean(name && name.includes(query));
  });

  const rows = filtered
    .map((channel) => {
      const id = channel.id?.trim();
      const name = channel.name?.trim();
      if (!id || !name) {
        return null;
      }
      return {
        kind: "group",
        id: `channel:${id}`,
        name,
        handle: `#${name}`,
        rank: buildChannelRank(channel),
        raw: channel,
      } satisfies ChannelDirectoryEntry;
    })
    .filter(Boolean) as ChannelDirectoryEntry[];

  if (typeof params.limit === "number" && params.limit > 0) {
    return rows.slice(0, params.limit);
  }
  return rows;
}
