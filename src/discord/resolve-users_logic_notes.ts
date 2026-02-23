/*
 * AUTO ANNOTATION
 * File: src/discord/resolve-users.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { fetchDiscord } from "./api.js";
import { listGuilds, type DiscordGuildSummary } from "./guilds.js";
import { normalizeDiscordSlug } from "./monitor/allow-list.js";
import { normalizeDiscordToken } from "./token.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordUser = {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string;
  bot?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordMember = {
  user: DiscordUser;
  nick?: string | null;
};

export type DiscordUserResolution = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  guildId?: string;
  guildName?: string;
  note?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseDiscordUserInput(raw: string): {
  userId?: string;
  guildId?: string;
  guildName?: string;
  userName?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mention = trimmed.match(/^<@!?(\d+)>$/);
  if (mention) {
    return { userId: mention[1] };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefixed = trimmed.match(/^(?:user:|discord:)?(\d+)$/i);
  if (prefixed) {
    return { userId: prefixed[1] };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const split = trimmed.includes("/") ? trimmed.split("/") : trimmed.split("#");
  if (split.length >= 2) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const guild = split[0]?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const user = split.slice(1).join("#").trim();
    if (guild && /^\d+$/.test(guild)) {
      return { guildId: guild, userName: user };
    }
    return { guildName: guild, userName: user };
  }
  return { userName: trimmed.replace(/^@/, "") };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function scoreDiscordMember(member: DiscordMember, query: string): number {
  const q = query.toLowerCase();
  const user = member.user;
  const candidates = [user.username, user.global_name, member.nick ?? undefined]
    .map((value) => value?.toLowerCase())
    .filter(Boolean) as string[];
  let score = 0;
  if (candidates.some((value) => value === q)) {
    score += 3;
  }
  if (candidates.some((value) => value?.includes(q))) {
    score += 1;
  }
  if (!user.bot) {
    score += 1;
  }
  return score;
}

export async function resolveDiscordUserAllowlist(params: {
  token: string;
  entries: string[];
  fetcher?: typeof fetch;
}): Promise<DiscordUserResolution[]> {
  const token = normalizeDiscordToken(params.token);
  if (!token) {
    return params.entries.map((input) => ({
      input,
      resolved: false,
    }));
  }
  const fetcher = params.fetcher ?? fetch;

  // Lazy-load guilds: only fetch when an entry actually needs username search.
  // This prevents listGuilds() failures (permissions, network) from blocking
  // resolution of plain user-id entries that don't need guild data at all.
  let guilds: DiscordGuildSummary[] | null = null;
  const getGuilds = async (): Promise<DiscordGuildSummary[]> => {
    if (!guilds) {
      guilds = await listGuilds(token, fetcher);
    }
    return guilds;
  };

  const results: DiscordUserResolution[] = [];

  for (const input of params.entries) {
    const parsed = parseDiscordUserInput(input);
    if (parsed.userId) {
      results.push({
        input,
        resolved: true,
        id: parsed.userId,
      });
      continue;
    }

    const query = parsed.userName?.trim();
    if (!query) {
      results.push({ input, resolved: false });
      continue;
    }

    const guildName = parsed.guildName?.trim();
    const allGuilds = await getGuilds();
    const guildList = parsed.guildId
      ? allGuilds.filter((g) => g.id === parsed.guildId)
      : guildName
        ? allGuilds.filter((g) => g.slug === normalizeDiscordSlug(guildName))
        : allGuilds;

    let best: { member: DiscordMember; guild: DiscordGuildSummary; score: number } | null = null;
    let matches = 0;

    for (const guild of guildList) {
      const paramsObj = new URLSearchParams({
        query,
        limit: "25",
      });
      const members = await fetchDiscord<DiscordMember[]>(
        `/guilds/${guild.id}/members/search?${paramsObj.toString()}`,
        token,
        fetcher,
      );
      for (const member of members) {
        const score = scoreDiscordMember(member, query);
        if (score === 0) {
          continue;
        }
        matches += 1;
        if (!best || score > best.score) {
          best = { member, guild, score };
        }
      }
    }

    if (best) {
      const user = best.member.user;
      const name =
        best.member.nick?.trim() || user.global_name?.trim() || user.username?.trim() || undefined;
      results.push({
        input,
        resolved: true,
        id: user.id,
        name,
        guildId: best.guild.id,
        guildName: best.guild.name,
        note: matches > 1 ? "multiple matches; chose best" : undefined,
      });
    } else {
      results.push({ input, resolved: false });
    }
  }

  return results;
}
