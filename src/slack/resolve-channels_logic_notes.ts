/*
 * AUTO ANNOTATION
 * File: src/slack/resolve-channels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebClient } from "@slack/web-api";
import { createSlackWebClient } from "./client.js";

export type SlackChannelLookup = {
  id: string;
  name: string;
  archived: boolean;
  isPrivate: boolean;
};

export type SlackChannelResolution = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  archived?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackListResponse = {
  channels?: Array<{
    id?: string;
    name?: string;
    is_archived?: boolean;
    is_private?: boolean;
  }>;
  response_metadata?: { next_cursor?: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseSlackChannelMention(raw: string): { id?: string; name?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mention = trimmed.match(/^<#([A-Z0-9]+)(?:\|([^>]+))?>$/i);
  if (mention) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = mention[1]?.toUpperCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const name = mention[2]?.trim();
    return { id, name };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefixed = trimmed.replace(/^(slack:|channel:)/i, "");
  if (/^[CG][A-Z0-9]+$/i.test(prefixed)) {
    return { id: prefixed.toUpperCase() };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = prefixed.replace(/^#/, "").trim();
  return name ? { name } : {};
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function listSlackChannels(client: WebClient): Promise<SlackChannelLookup[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channels: SlackChannelLookup[] = [];
  let cursor: string | undefined;
  do {
    const res = (await client.conversations.list({
      types: "public_channel,private_channel",
      exclude_archived: false,
      limit: 1000,
      cursor,
    })) as SlackListResponse;
    for (const channel of res.channels ?? []) {
      const id = channel.id?.trim();
      const name = channel.name?.trim();
      if (!id || !name) {
        continue;
      }
      channels.push({
        id,
        name,
        archived: Boolean(channel.is_archived),
        isPrivate: Boolean(channel.is_private),
      });
    }
    const next = res.response_metadata?.next_cursor?.trim();
    cursor = next ? next : undefined;
  } while (cursor);
  return channels;
}

function resolveByName(
  name: string,
  channels: SlackChannelLookup[],
): SlackChannelLookup | undefined {
  const target = name.trim().toLowerCase();
  if (!target) {
    return undefined;
  }
  const matches = channels.filter((channel) => channel.name.toLowerCase() === target);
  if (matches.length === 0) {
    return undefined;
  }
  const active = matches.find((channel) => !channel.archived);
  return active ?? matches[0];
}

export async function resolveSlackChannelAllowlist(params: {
  token: string;
  entries: string[];
  client?: WebClient;
}): Promise<SlackChannelResolution[]> {
  const client = params.client ?? createSlackWebClient(params.token);
  const channels = await listSlackChannels(client);
  const results: SlackChannelResolution[] = [];

  for (const input of params.entries) {
    const parsed = parseSlackChannelMention(input);
    if (parsed.id) {
      const match = channels.find((channel) => channel.id === parsed.id);
      results.push({
        input,
        resolved: true,
        id: parsed.id,
        name: match?.name ?? parsed.name,
        archived: match?.archived,
      });
      continue;
    }
    if (parsed.name) {
      const match = resolveByName(parsed.name, channels);
      if (match) {
        results.push({
          input,
          resolved: true,
          id: match.id,
          name: match.name,
          archived: match.archived,
        });
        continue;
      }
    }
    results.push({ input, resolved: false });
  }

  return results;
}
