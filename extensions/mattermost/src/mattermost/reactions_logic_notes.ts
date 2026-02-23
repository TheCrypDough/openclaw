/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/reactions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { resolveMattermostAccount } from "./accounts.js";
import { createMattermostClient, fetchMattermostMe, type MattermostClient } from "./client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Result = { ok: true } | { ok: false; error: string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ReactionParams = {
  cfg: OpenClawConfig;
  postId: string;
  emojiName: string;
  accountId?: string | null;
  fetchImpl?: typeof fetch;
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ReactionMutation = (client: MattermostClient, params: MutationPayload) => Promise<void>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MutationPayload = { userId: string; postId: string; emojiName: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BOT_USER_CACHE_TTL_MS = 10 * 60_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const botUserIdCache = new Map<string, { userId: string; expiresAt: number }>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function resolveBotUserId(
  client: MattermostClient,
  cacheKey: string,
): Promise<string | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = botUserIdCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.userId;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const me = await fetchMattermostMe(client);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userId = me?.id?.trim();
  if (!userId) {
    return null;
  }
  botUserIdCache.set(cacheKey, { userId, expiresAt: Date.now() + BOT_USER_CACHE_TTL_MS });
  return userId;
}

export async function addMattermostReaction(params: {
  cfg: OpenClawConfig;
  postId: string;
  emojiName: string;
  accountId?: string | null;
  fetchImpl?: typeof fetch;
}): Promise<Result> {
  return runMattermostReaction(params, {
    action: "add",
    mutation: createReaction,
  });
}

export async function removeMattermostReaction(params: {
  cfg: OpenClawConfig;
  postId: string;
  emojiName: string;
  accountId?: string | null;
  fetchImpl?: typeof fetch;
}): Promise<Result> {
  return runMattermostReaction(params, {
    action: "remove",
    mutation: deleteReaction,
  });
}

export function resetMattermostReactionBotUserCacheForTests(): void {
  botUserIdCache.clear();
}

async function runMattermostReaction(
  params: ReactionParams,
  options: {
    action: "add" | "remove";
    mutation: ReactionMutation;
  },
): Promise<Result> {
  const resolved = resolveMattermostAccount({ cfg: params.cfg, accountId: params.accountId });
  const baseUrl = resolved.baseUrl?.trim();
  const botToken = resolved.botToken?.trim();
  if (!baseUrl || !botToken) {
    return { ok: false, error: "Mattermost botToken/baseUrl missing." };
  }

  const client = createMattermostClient({
    baseUrl,
    botToken,
    fetchImpl: params.fetchImpl,
  });

  const cacheKey = `${baseUrl}:${botToken}`;
  const userId = await resolveBotUserId(client, cacheKey);
  if (!userId) {
    return { ok: false, error: "Mattermost reactions failed: could not resolve bot user id." };
  }

  try {
    await options.mutation(client, {
      userId,
      postId: params.postId,
      emojiName: params.emojiName,
    });
  } catch (err) {
    return { ok: false, error: `Mattermost ${options.action} reaction failed: ${String(err)}` };
  }

  return { ok: true };
}

async function createReaction(client: MattermostClient, params: MutationPayload): Promise<void> {
  await client.request<Record<string, unknown>>("/reactions", {
    method: "POST",
    body: JSON.stringify({
      user_id: params.userId,
      post_id: params.postId,
      emoji_name: params.emojiName,
    }),
  });
}

async function deleteReaction(client: MattermostClient, params: MutationPayload): Promise<void> {
  const emoji = encodeURIComponent(params.emojiName);
  await client.request<unknown>(
    `/users/${params.userId}/posts/${params.postId}/reactions/${emoji}`,
    {
      method: "DELETE",
    },
  );
}
