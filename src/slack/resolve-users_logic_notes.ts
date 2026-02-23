/*
 * AUTO ANNOTATION
 * File: src/slack/resolve-users.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebClient } from "@slack/web-api";
import { createSlackWebClient } from "./client.js";

export type SlackUserLookup = {
  id: string;
  name: string;
  displayName?: string;
  realName?: string;
  email?: string;
  deleted: boolean;
  isBot: boolean;
  isAppUser: boolean;
};

export type SlackUserResolution = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  email?: string;
  deleted?: boolean;
  isBot?: boolean;
  note?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackListUsersResponse = {
  members?: Array<{
    id?: string;
    name?: string;
    deleted?: boolean;
    is_bot?: boolean;
    is_app_user?: boolean;
    real_name?: string;
    profile?: {
      display_name?: string;
      real_name?: string;
      email?: string;
    };
  }>;
  response_metadata?: { next_cursor?: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseSlackUserInput(raw: string): { id?: string; name?: string; email?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
  if (mention) {
    return { id: mention[1]?.toUpperCase() };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefixed = trimmed.replace(/^(slack:|user:)/i, "");
  if (/^[A-Z][A-Z0-9]+$/i.test(prefixed)) {
    return { id: prefixed.toUpperCase() };
  }
  if (trimmed.includes("@") && !trimmed.startsWith("@")) {
    return { email: trimmed.toLowerCase() };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = trimmed.replace(/^@/, "").trim();
  return name ? { name } : {};
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function listSlackUsers(client: WebClient): Promise<SlackUserLookup[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const users: SlackUserLookup[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cursor: string | undefined;
  do {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = (await client.users.list({
      limit: 200,
      cursor,
    })) as SlackListUsersResponse;
    for (const member of res.members ?? []) {
      const id = member.id?.trim();
      const name = member.name?.trim();
      if (!id || !name) {
        continue;
      }
      const profile = member.profile ?? {};
      users.push({
        id,
        name,
        displayName: profile.display_name?.trim() || undefined,
        realName: profile.real_name?.trim() || member.real_name?.trim() || undefined,
        email: profile.email?.trim()?.toLowerCase() || undefined,
        deleted: Boolean(member.deleted),
        isBot: Boolean(member.is_bot),
        isAppUser: Boolean(member.is_app_user),
      });
    }
    const next = res.response_metadata?.next_cursor?.trim();
    cursor = next ? next : undefined;
  } while (cursor);
  return users;
}

function scoreSlackUser(user: SlackUserLookup, match: { name?: string; email?: string }): number {
  let score = 0;
  if (!user.deleted) {
    score += 3;
  }
  if (!user.isBot && !user.isAppUser) {
    score += 2;
  }
  if (match.email && user.email === match.email) {
    score += 5;
  }
  if (match.name) {
    const target = match.name.toLowerCase();
    const candidates = [user.name, user.displayName, user.realName]
      .map((value) => value?.toLowerCase())
      .filter(Boolean) as string[];
    if (candidates.some((value) => value === target)) {
      score += 2;
    }
  }
  return score;
}

function resolveSlackUserFromMatches(
  input: string,
  matches: SlackUserLookup[],
  parsed: { name?: string; email?: string },
): SlackUserResolution {
  const scored = matches
    .map((user) => ({ user, score: scoreSlackUser(user, parsed) }))
    .toSorted((a, b) => b.score - a.score);
  const best = scored[0]?.user ?? matches[0];
  return {
    input,
    resolved: true,
    id: best.id,
    name: best.displayName ?? best.realName ?? best.name,
    email: best.email,
    deleted: best.deleted,
    isBot: best.isBot,
    note: matches.length > 1 ? "multiple matches; chose best" : undefined,
  };
}

export async function resolveSlackUserAllowlist(params: {
  token: string;
  entries: string[];
  client?: WebClient;
}): Promise<SlackUserResolution[]> {
  const client = params.client ?? createSlackWebClient(params.token);
  const users = await listSlackUsers(client);
  const results: SlackUserResolution[] = [];

  for (const input of params.entries) {
    const parsed = parseSlackUserInput(input);
    if (parsed.id) {
      const match = users.find((user) => user.id === parsed.id);
      results.push({
        input,
        resolved: true,
        id: parsed.id,
        name: match?.displayName ?? match?.realName ?? match?.name,
        email: match?.email,
        deleted: match?.deleted,
        isBot: match?.isBot,
      });
      continue;
    }
    if (parsed.email) {
      const matches = users.filter((user) => user.email === parsed.email);
      if (matches.length > 0) {
        results.push(resolveSlackUserFromMatches(input, matches, parsed));
        continue;
      }
    }
    if (parsed.name) {
      const target = parsed.name.toLowerCase();
      const matches = users.filter((user) => {
        const candidates = [user.name, user.displayName, user.realName]
          .map((value) => value?.toLowerCase())
          .filter(Boolean) as string[];
        return candidates.includes(target);
      });
      if (matches.length > 0) {
        results.push(resolveSlackUserFromMatches(input, matches, parsed));
        continue;
      }
    }

    results.push({ input, resolved: false });
  }

  return results;
}
