/*
 * AUTO ANNOTATION
 * File: src/discord/guilds.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { fetchDiscord } from "./api.js";
import { normalizeDiscordSlug } from "./monitor/allow-list.js";

export type DiscordGuildSummary = {
  id: string;
  name: string;
  slug: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listGuilds(
  token: string,
  fetcher: typeof fetch,
): Promise<DiscordGuildSummary[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = await fetchDiscord<Array<{ id?: string; name?: string }>>(
    "/users/@me/guilds",
    token,
    fetcher,
  );
  return raw
    .filter(
      (guild): guild is { id: string; name: string } =>
        typeof guild.id === "string" && typeof guild.name === "string",
    )
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      slug: normalizeDiscordSlug(guild.name),
    }));
}
