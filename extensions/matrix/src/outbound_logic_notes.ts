/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/outbound.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk";
import { sendMessageMatrix, sendPollMatrix } from "./matrix/send.js";
import { getMatrixRuntime } from "./runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const matrixOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit) => getMatrixRuntime().channel.text.chunkMarkdownText(text, limit),
  chunkerMode: "markdown",
  textChunkLimit: 4000,
  sendText: async ({ to, text, deps, replyToId, threadId, accountId }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send = deps?.sendMatrix ?? sendMessageMatrix;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedThreadId =
      threadId !== undefined && threadId !== null ? String(threadId) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text, {
      replyToId: replyToId ?? undefined,
      threadId: resolvedThreadId,
      accountId: accountId ?? undefined,
    });
    return {
      channel: "matrix",
      messageId: result.messageId,
      roomId: result.roomId,
    };
  },
  sendMedia: async ({ to, text, mediaUrl, deps, replyToId, threadId, accountId }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send = deps?.sendMatrix ?? sendMessageMatrix;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedThreadId =
      threadId !== undefined && threadId !== null ? String(threadId) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text, {
      mediaUrl,
      replyToId: replyToId ?? undefined,
      threadId: resolvedThreadId,
      accountId: accountId ?? undefined,
    });
    return {
      channel: "matrix",
      messageId: result.messageId,
      roomId: result.roomId,
    };
  },
  sendPoll: async ({ to, poll, threadId, accountId }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedThreadId =
      threadId !== undefined && threadId !== null ? String(threadId) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendPollMatrix(to, poll, {
      threadId: resolvedThreadId,
      accountId: accountId ?? undefined,
    });
    return {
      channel: "matrix",
      messageId: result.eventId,
      roomId: result.roomId,
      pollId: result.eventId,
    };
  },
};
