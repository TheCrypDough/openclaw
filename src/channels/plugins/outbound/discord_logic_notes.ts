/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/outbound/discord.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  getThreadBindingManager,
  type ThreadBindingRecord,
} from "../../../discord/monitor/thread-bindings.js";
import {
  sendMessageDiscord,
  sendPollDiscord,
  sendWebhookMessageDiscord,
} from "../../../discord/send.js";
import type { OutboundIdentity } from "../../../infra/outbound/identity.js";
import { normalizeDiscordOutboundTarget } from "../normalize/discord.js";
import type { ChannelOutboundAdapter } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveDiscordOutboundTarget(params: {
  to: string;
  threadId?: string | number | null;
}): string {
  if (params.threadId == null) {
    return params.to;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadId = String(params.threadId).trim();
  if (!threadId) {
    return params.to;
  }
  return `channel:${threadId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveDiscordWebhookIdentity(params: {
  identity?: OutboundIdentity;
  binding: ThreadBindingRecord;
}): { username?: string; avatarUrl?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const usernameRaw = params.identity?.name?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallbackUsername = params.binding.label?.trim() || params.binding.agentId;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const username = (usernameRaw || fallbackUsername || "").slice(0, 80) || undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const avatarUrl = params.identity?.avatarUrl?.trim() || undefined;
  return { username, avatarUrl };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function maybeSendDiscordWebhookText(params: {
  text: string;
  threadId?: string | number | null;
  accountId?: string | null;
  identity?: OutboundIdentity;
  replyToId?: string | null;
}): Promise<{ messageId: string; channelId: string } | null> {
  if (params.threadId == null) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const threadId = String(params.threadId).trim();
  if (!threadId) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const manager = getThreadBindingManager(params.accountId ?? undefined);
  if (!manager) {
    return null;
  }
  const binding = manager.getByThreadId(threadId);
  if (!binding?.webhookId || !binding?.webhookToken) {
    return null;
  }
  const persona = resolveDiscordWebhookIdentity({
    identity: params.identity,
    binding,
  });
  const result = await sendWebhookMessageDiscord(params.text, {
    webhookId: binding.webhookId,
    webhookToken: binding.webhookToken,
    accountId: binding.accountId,
    threadId: binding.threadId,
    replyTo: params.replyToId ?? undefined,
    username: persona.username,
    avatarUrl: persona.avatarUrl,
  });
  return result;
}

export const discordOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: null,
  textChunkLimit: 2000,
  pollMaxOptions: 10,
  resolveTarget: ({ to }) => normalizeDiscordOutboundTarget(to),
  sendText: async ({ to, text, accountId, deps, replyToId, threadId, identity, silent }) => {
    if (!silent) {
      const webhookResult = await maybeSendDiscordWebhookText({
        text,
        threadId,
        accountId,
        identity,
        replyToId,
      }).catch(() => null);
      if (webhookResult) {
        return { channel: "discord", ...webhookResult };
      }
    }
    const send = deps?.sendDiscord ?? sendMessageDiscord;
    const target = resolveDiscordOutboundTarget({ to, threadId });
    const result = await send(target, text, {
      verbose: false,
      replyTo: replyToId ?? undefined,
      accountId: accountId ?? undefined,
      silent: silent ?? undefined,
    });
    return { channel: "discord", ...result };
  },
  sendMedia: async ({
    to,
    text,
    mediaUrl,
    mediaLocalRoots,
    accountId,
    deps,
    replyToId,
    threadId,
    silent,
  }) => {
    const send = deps?.sendDiscord ?? sendMessageDiscord;
    const target = resolveDiscordOutboundTarget({ to, threadId });
    const result = await send(target, text, {
      verbose: false,
      mediaUrl,
      mediaLocalRoots,
      replyTo: replyToId ?? undefined,
      accountId: accountId ?? undefined,
      silent: silent ?? undefined,
    });
    return { channel: "discord", ...result };
  },
  sendPoll: async ({ to, poll, accountId, threadId, silent }) => {
    const target = resolveDiscordOutboundTarget({ to, threadId });
    return await sendPollDiscord(target, poll, {
      accountId: accountId ?? undefined,
      silent: silent ?? undefined,
    });
  },
};
