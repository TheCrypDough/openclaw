/*
 * AUTO ANNOTATION
 * File: src/line/reply-chunks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { messagingApi } from "@line/bot-sdk";

export type LineReplyMessage = messagingApi.TextMessage;

export type SendLineReplyChunksParams = {
  to: string;
  chunks: string[];
  quickReplies?: string[];
  replyToken?: string | null;
  replyTokenUsed?: boolean;
  accountId?: string;
  replyMessageLine: (
    replyToken: string,
    messages: messagingApi.Message[],
    opts?: { accountId?: string },
  ) => Promise<unknown>;
  pushMessageLine: (to: string, text: string, opts?: { accountId?: string }) => Promise<unknown>;
  pushTextMessageWithQuickReplies: (
    to: string,
    text: string,
    quickReplies: string[],
    opts?: { accountId?: string },
  ) => Promise<unknown>;
  createTextMessageWithQuickReplies: (text: string, quickReplies: string[]) => LineReplyMessage;
  onReplyError?: (err: unknown) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendLineReplyChunks(
  params: SendLineReplyChunksParams,
): Promise<{ replyTokenUsed: boolean }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasQuickReplies = Boolean(params.quickReplies?.length);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let replyTokenUsed = Boolean(params.replyTokenUsed);

  if (params.chunks.length === 0) {
    return { replyTokenUsed };
  }

  if (params.replyToken && !replyTokenUsed) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const replyBatch = params.chunks.slice(0, 5);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const remaining = params.chunks.slice(replyBatch.length);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const replyMessages: LineReplyMessage[] = replyBatch.map((chunk) => ({
        type: "text",
        text: chunk,
      }));

      if (hasQuickReplies && remaining.length === 0 && replyMessages.length > 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const lastIndex = replyMessages.length - 1;
        replyMessages[lastIndex] = params.createTextMessageWithQuickReplies(
          replyBatch[lastIndex],
          params.quickReplies!,
        );
      }

      await params.replyMessageLine(params.replyToken, replyMessages, {
        accountId: params.accountId,
      });
      replyTokenUsed = true;

      for (let i = 0; i < remaining.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const isLastChunk = i === remaining.length - 1;
        if (isLastChunk && hasQuickReplies) {
          await params.pushTextMessageWithQuickReplies(
            params.to,
            remaining[i],
            params.quickReplies!,
            { accountId: params.accountId },
          );
        } else {
          await params.pushMessageLine(params.to, remaining[i], {
            accountId: params.accountId,
          });
        }
      }

      return { replyTokenUsed };
    } catch (err) {
      params.onReplyError?.(err);
      replyTokenUsed = true;
    }
  }

  for (let i = 0; i < params.chunks.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const isLastChunk = i === params.chunks.length - 1;
    if (isLastChunk && hasQuickReplies) {
      await params.pushTextMessageWithQuickReplies(
        params.to,
        params.chunks[i],
        params.quickReplies!,
        { accountId: params.accountId },
      );
    } else {
      await params.pushMessageLine(params.to, params.chunks[i], {
        accountId: params.accountId,
      });
    }
  }

  return { replyTokenUsed };
}
