/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/reactions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { resolveBlueBubblesServerAccount } from "./account-resolve.js";
import { getCachedBlueBubblesPrivateApiStatus } from "./probe.js";
import { blueBubblesFetchWithTimeout, buildBlueBubblesApiUrl } from "./types.js";

export type BlueBubblesReactionOpts = {
  serverUrl?: string;
  password?: string;
  accountId?: string;
  timeoutMs?: number;
  cfg?: OpenClawConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const REACTION_TYPES = new Set(["love", "like", "dislike", "laugh", "emphasize", "question"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const REACTION_ALIASES = new Map<string, string>([
  // General
  ["heart", "love"],
  ["love", "love"],
  ["❤", "love"],
  ["❤️", "love"],
  ["red_heart", "love"],
  ["thumbs_up", "like"],
  ["thumbsup", "like"],
  ["thumbs-up", "like"],
  ["thumbsup", "like"],
  ["like", "like"],
  ["thumb", "like"],
  ["ok", "like"],
  ["thumbs_down", "dislike"],
  ["thumbsdown", "dislike"],
  ["thumbs-down", "dislike"],
  ["dislike", "dislike"],
  ["boo", "dislike"],
  ["no", "dislike"],
  // Laugh
  ["haha", "laugh"],
  ["lol", "laugh"],
  ["lmao", "laugh"],
  ["rofl", "laugh"],
  ["😂", "laugh"],
  ["🤣", "laugh"],
  ["xd", "laugh"],
  ["laugh", "laugh"],
  // Emphasize / exclaim
  ["emphasis", "emphasize"],
  ["emphasize", "emphasize"],
  ["exclaim", "emphasize"],
  ["!!", "emphasize"],
  ["‼", "emphasize"],
  ["‼️", "emphasize"],
  ["❗", "emphasize"],
  ["important", "emphasize"],
  ["bang", "emphasize"],
  // Question
  ["question", "question"],
  ["?", "question"],
  ["❓", "question"],
  ["❔", "question"],
  ["ask", "question"],
  // Apple/Messages names
  ["loved", "love"],
  ["liked", "like"],
  ["disliked", "dislike"],
  ["laughed", "laugh"],
  ["emphasized", "emphasize"],
  ["questioned", "question"],
  // Colloquial / informal
  ["fire", "love"],
  ["🔥", "love"],
  ["wow", "emphasize"],
  ["!", "emphasize"],
  // Edge: generic emoji name forms
  ["heart_eyes", "love"],
  ["smile", "laugh"],
  ["smiley", "laugh"],
  ["happy", "laugh"],
  ["joy", "laugh"],
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const REACTION_EMOJIS = new Map<string, string>([
  // Love
  ["❤️", "love"],
  ["❤", "love"],
  ["♥️", "love"],
  ["♥", "love"],
  ["😍", "love"],
  ["💕", "love"],
  // Like
  ["👍", "like"],
  ["👌", "like"],
  // Dislike
  ["👎", "dislike"],
  ["🙅", "dislike"],
  // Laugh
  ["😂", "laugh"],
  ["🤣", "laugh"],
  ["😆", "laugh"],
  ["😁", "laugh"],
  ["😹", "laugh"],
  // Emphasize
  ["‼️", "emphasize"],
  ["‼", "emphasize"],
  ["!!", "emphasize"],
  ["❗", "emphasize"],
  ["❕", "emphasize"],
  ["!", "emphasize"],
  // Question
  ["❓", "question"],
  ["❔", "question"],
  ["?", "question"],
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccount(params: BlueBubblesReactionOpts) {
  return resolveBlueBubblesServerAccount(params);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeBlueBubblesReactionInput(emoji: string, remove?: boolean): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = emoji.trim();
  if (!trimmed) {
    throw new Error("BlueBubbles reaction requires an emoji or name.");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let raw = trimmed.toLowerCase();
  if (raw.startsWith("-")) {
    raw = raw.slice(1);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliased = REACTION_ALIASES.get(raw) ?? raw;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mapped = REACTION_EMOJIS.get(trimmed) ?? REACTION_EMOJIS.get(raw) ?? aliased;
  if (!REACTION_TYPES.has(mapped)) {
    throw new Error(`Unsupported BlueBubbles reaction: ${trimmed}`);
  }
  return remove ? `-${mapped}` : mapped;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendBlueBubblesReaction(params: {
  chatGuid: string;
  messageGuid: string;
  emoji: string;
  remove?: boolean;
  partIndex?: number;
  opts?: BlueBubblesReactionOpts;
}): Promise<void> {
  const chatGuid = params.chatGuid.trim();
  const messageGuid = params.messageGuid.trim();
  if (!chatGuid) {
    throw new Error("BlueBubbles reaction requires chatGuid.");
  }
  if (!messageGuid) {
    throw new Error("BlueBubbles reaction requires messageGuid.");
  }
  const reaction = normalizeBlueBubblesReactionInput(params.emoji, params.remove);
  const { baseUrl, password, accountId } = resolveAccount(params.opts ?? {});
  if (getCachedBlueBubblesPrivateApiStatus(accountId) === false) {
    throw new Error(
      "BlueBubbles reaction requires Private API, but it is disabled on the BlueBubbles server.",
    );
  }
  const url = buildBlueBubblesApiUrl({
    baseUrl,
    path: "/api/v1/message/react",
    password,
  });
  const payload = {
    chatGuid,
    selectedMessageGuid: messageGuid,
    reaction,
    partIndex: typeof params.partIndex === "number" ? params.partIndex : 0,
  };
  const res = await blueBubblesFetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    params.opts?.timeoutMs,
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`BlueBubbles reaction failed (${res.status}): ${errorText || "unknown"}`);
  }
}
