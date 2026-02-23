/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/replies.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";
import type { MarkdownTableMode, ReplyPayload, RuntimeEnv } from "openclaw/plugin-sdk";
import { getMatrixRuntime } from "../../runtime.js";
import { sendMessageMatrix } from "../send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function deliverMatrixReplies(params: {
  replies: ReplyPayload[];
  roomId: string;
  client: MatrixClient;
  runtime: RuntimeEnv;
  textLimit: number;
  replyToMode: "off" | "first" | "all";
  threadId?: string;
  accountId?: string;
  tableMode?: MarkdownTableMode;
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const core = getMatrixRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = core.config.loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tableMode =
    params.tableMode ??
    core.channel.text.resolveMarkdownTableMode({
      cfg,
      channel: "matrix",
      accountId: params.accountId,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logVerbose = (message: string) => {
    if (core.logging.shouldLogVerbose()) {
      params.runtime.log?.(message);
    }
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunkLimit = Math.min(params.textLimit, 4000);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunkMode = core.channel.text.resolveChunkMode(cfg, "matrix", params.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasReplied = false;
  for (const reply of params.replies) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hasMedia = Boolean(reply?.mediaUrl) || (reply?.mediaUrls?.length ?? 0) > 0;
    if (!reply?.text && !hasMedia) {
      if (reply?.audioAsVoice) {
        logVerbose("matrix reply has audioAsVoice without media/text; skipping");
        continue;
      }
      params.runtime.error?.("matrix reply missing text/media");
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const replyToIdRaw = reply.replyToId?.trim();
    const replyToId = params.threadId || params.replyToMode === "off" ? undefined : replyToIdRaw;
    const rawText = reply.text ?? "";
    const text = core.channel.text.convertMarkdownTables(rawText, tableMode);
    const mediaList = reply.mediaUrls?.length
      ? reply.mediaUrls
      : reply.mediaUrl
        ? [reply.mediaUrl]
        : [];

    const shouldIncludeReply = (id?: string) =>
      Boolean(id) && (params.replyToMode === "all" || !hasReplied);
    const replyToIdForReply = shouldIncludeReply(replyToId) ? replyToId : undefined;

    if (mediaList.length === 0) {
      let sentTextChunk = false;
      for (const chunk of core.channel.text.chunkMarkdownTextWithMode(
        text,
        chunkLimit,
        chunkMode,
      )) {
        const trimmed = chunk.trim();
        if (!trimmed) {
          continue;
        }
        await sendMessageMatrix(params.roomId, trimmed, {
          client: params.client,
          replyToId: replyToIdForReply,
          threadId: params.threadId,
          accountId: params.accountId,
        });
        sentTextChunk = true;
      }
      if (replyToIdForReply && !hasReplied && sentTextChunk) {
        hasReplied = true;
      }
      continue;
    }

    let first = true;
    for (const mediaUrl of mediaList) {
      const caption = first ? text : "";
      await sendMessageMatrix(params.roomId, caption, {
        client: params.client,
        mediaUrl,
        replyToId: replyToIdForReply,
        threadId: params.threadId,
        audioAsVoice: reply.audioAsVoice,
        accountId: params.accountId,
      });
      first = false;
    }
    if (replyToIdForReply && !hasReplied) {
      hasReplied = true;
    }
  }
}
