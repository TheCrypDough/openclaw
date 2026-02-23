/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/directory-live.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelDirectoryEntry } from "openclaw/plugin-sdk";
import {
  escapeOData,
  fetchGraphJson,
  type GraphChannel,
  type GraphGroup,
  type GraphResponse,
  type GraphUser,
  listChannelsForTeam,
  listTeamsByName,
  normalizeQuery,
  resolveGraphToken,
} from "./graph.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listMSTeamsDirectoryPeersLive(params: {
  cfg: unknown;
  query?: string | null;
  limit?: number | null;
}): Promise<ChannelDirectoryEntry[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const query = normalizeQuery(params.query);
  if (!query) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = await resolveGraphToken(params.cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let users: GraphUser[] = [];
  if (query.includes("@")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const escaped = escapeOData(query);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filter = `(mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = `/users?$filter=${encodeURIComponent(filter)}&$select=id,displayName,mail,userPrincipalName`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await fetchGraphJson<GraphResponse<GraphUser>>({ token, path });
    users = res.value ?? [];
  } else {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = `/users?$search=${encodeURIComponent(`"displayName:${query}"`)}&$select=id,displayName,mail,userPrincipalName&$top=${limit}`;
    const res = await fetchGraphJson<GraphResponse<GraphUser>>({
      token,
      path,
      headers: { ConsistencyLevel: "eventual" },
    });
    users = res.value ?? [];
  }

  return users
    .map((user) => {
      const id = user.id?.trim();
      if (!id) {
        return null;
      }
      const name = user.displayName?.trim();
      const handle = user.userPrincipalName?.trim() || user.mail?.trim();
      return {
        kind: "user",
        id: `user:${id}`,
        name: name || undefined,
        handle: handle ? `@${handle}` : undefined,
        raw: user,
      } satisfies ChannelDirectoryEntry;
    })
    .filter(Boolean) as ChannelDirectoryEntry[];
}

export async function listMSTeamsDirectoryGroupsLive(params: {
  cfg: unknown;
  query?: string | null;
  limit?: number | null;
}): Promise<ChannelDirectoryEntry[]> {
  const rawQuery = normalizeQuery(params.query);
  if (!rawQuery) {
    return [];
  }
  const token = await resolveGraphToken(params.cfg);
  const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
  const [teamQuery, channelQuery] = rawQuery.includes("/")
    ? rawQuery
        .split("/", 2)
        .map((part) => part.trim())
        .filter(Boolean)
    : [rawQuery, null];

  const teams = await listTeamsByName(token, teamQuery);
  const results: ChannelDirectoryEntry[] = [];

  for (const team of teams) {
    const teamId = team.id?.trim();
    if (!teamId) {
      continue;
    }
    const teamName = team.displayName?.trim() || teamQuery;
    if (!channelQuery) {
      results.push({
        kind: "group",
        id: `team:${teamId}`,
        name: teamName,
        handle: teamName ? `#${teamName}` : undefined,
        raw: team,
      });
      if (results.length >= limit) {
        return results;
      }
      continue;
    }
    const channels = await listChannelsForTeam(token, teamId);
    for (const channel of channels) {
      const name = channel.displayName?.trim();
      if (!name) {
        continue;
      }
      if (!name.toLowerCase().includes(channelQuery.toLowerCase())) {
        continue;
      }
      results.push({
        kind: "group",
        id: `conversation:${channel.id}`,
        name: `${teamName}/${name}`,
        handle: `#${name}`,
        raw: channel,
      });
      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}
