/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/monitor/history.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "openclaw/plugin-sdk";
import { extractMessageText } from "./utils.js";

export type TlonHistoryEntry = {
  author: string;
  content: string;
  timestamp: number;
  id?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const messageCache = new Map<string, TlonHistoryEntry[]>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_CACHED_MESSAGES = 100;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function cacheMessage(channelNest: string, message: TlonHistoryEntry) {
  if (!messageCache.has(channelNest)) {
    messageCache.set(channelNest, []);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cache = messageCache.get(channelNest);
  if (!cache) {
    return;
  }
  cache.unshift(message);
  if (cache.length > MAX_CACHED_MESSAGES) {
    cache.pop();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchChannelHistory(
  api: { scry: (path: string) => Promise<unknown> },
  channelNest: string,
  count = 50,
  runtime?: RuntimeEnv,
): Promise<TlonHistoryEntry[]> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const scryPath = `/channels/v4/${channelNest}/posts/newest/${count}/outline.json`;
    runtime?.log?.(`[tlon] Fetching history: ${scryPath}`);

    // oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const data: any = await api.scry(scryPath);
    if (!data) {
      return [];
    }

    // oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let posts: any[] = [];
    if (Array.isArray(data)) {
      posts = data;
    } else if (data.posts && typeof data.posts === "object") {
      posts = Object.values(data.posts);
    } else if (typeof data === "object") {
      posts = Object.values(data);
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messages = posts
      .map((item) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const essay = item.essay || item["r-post"]?.set?.essay;
        const seal = item.seal || item["r-post"]?.set?.seal;

        return {
          author: essay?.author || "unknown",
          content: extractMessageText(essay?.content || []),
          timestamp: essay?.sent || Date.now(),
          id: seal?.id,
        } as TlonHistoryEntry;
      })
      .filter((msg) => msg.content);

    runtime?.log?.(`[tlon] Extracted ${messages.length} messages from history`);
    return messages;
  } catch (error) {
    runtime?.log?.(
      `[tlon] Error fetching channel history: ${(error as { message?: string })?.message ?? String(error)}`,
    );
    return [];
  }
}

export async function getChannelHistory(
  api: { scry: (path: string) => Promise<unknown> },
  channelNest: string,
  count = 50,
  runtime?: RuntimeEnv,
): Promise<TlonHistoryEntry[]> {
  const cache = messageCache.get(channelNest) ?? [];
  if (cache.length >= count) {
    runtime?.log?.(`[tlon] Using cached messages (${cache.length} available)`);
    return cache.slice(0, count);
  }

  runtime?.log?.(`[tlon] Cache has ${cache.length} messages, need ${count}, fetching from scry...`);
  return await fetchChannelHistory(api, channelNest, count, runtime);
}
