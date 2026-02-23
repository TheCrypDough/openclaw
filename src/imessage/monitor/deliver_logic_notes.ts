/*
 * AUTO ANNOTATION
 * File: src/imessage/monitor/deliver.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { chunkTextWithMode, resolveChunkMode } from "../../auto-reply/chunk.js";
import type { ReplyPayload } from "../../auto-reply/types.js";
import { loadConfig } from "../../config/config.js";
import { resolveMarkdownTableMode } from "../../config/markdown-tables.js";
import { convertMarkdownTables } from "../../markdown/tables.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { createIMessageRpcClient } from "../client.js";
import { sendMessageIMessage } from "../send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SentMessageCache = {
  remember: (scope: string, text: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function deliverReplies(params: {
  replies: ReplyPayload[];
  target: string;
  client: Awaited<ReturnType<typeof createIMessageRpcClient>>;
  accountId?: string;
  runtime: RuntimeEnv;
  maxBytes: number;
  textLimit: number;
  sentMessageCache?: SentMessageCache;
}) {
  const { replies, target, client, runtime, maxBytes, textLimit, accountId, sentMessageCache } =
    params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scope = `${accountId ?? ""}:${target}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "imessage",
    accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunkMode = resolveChunkMode(cfg, "imessage", accountId);
  for (const payload of replies) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mediaList = payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : []);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rawText = payload.text ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = convertMarkdownTables(rawText, tableMode);
    if (!text && mediaList.length === 0) {
      continue;
    }
    if (mediaList.length === 0) {
      sentMessageCache?.remember(scope, text);
      for (const chunk of chunkTextWithMode(text, textLimit, chunkMode)) {
        await sendMessageIMessage(target, chunk, {
          maxBytes,
          client,
          accountId,
          replyToId: payload.replyToId,
        });
        sentMessageCache?.remember(scope, chunk);
      }
    } else {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let first = true;
      for (const url of mediaList) {
        const caption = first ? text : "";
        first = false;
        await sendMessageIMessage(target, caption, {
          mediaUrl: url,
          maxBytes,
          client,
          accountId,
          replyToId: payload.replyToId,
        });
        if (caption) {
          sentMessageCache?.remember(scope, caption);
        }
      }
    }
    runtime.log?.(`imessage: delivered reply to ${target}`);
  }
}
