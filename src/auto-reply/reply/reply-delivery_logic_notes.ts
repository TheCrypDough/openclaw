/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/reply-delivery.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { logVerbose } from "../../globals.js";
import { SILENT_REPLY_TOKEN } from "../tokens.js";
import type { BlockReplyContext, ReplyPayload } from "../types.js";
import type { BlockReplyPipeline } from "./block-reply-pipeline.js";
import { createBlockReplyPayloadKey } from "./block-reply-pipeline.js";
import { parseReplyDirectives } from "./reply-directives.js";
import { applyReplyTagsToPayload, isRenderablePayload } from "./reply-payloads.js";
import type { TypingSignaler } from "./typing-mode.js";

export type ReplyDirectiveParseMode = "always" | "auto" | "never";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeReplyPayloadDirectives(params: {
  payload: ReplyPayload;
  currentMessageId?: string;
  silentToken?: string;
  trimLeadingWhitespace?: boolean;
  parseMode?: ReplyDirectiveParseMode;
}): { payload: ReplyPayload; isSilent: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parseMode = params.parseMode ?? "always";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const silentToken = params.silentToken ?? SILENT_REPLY_TOKEN;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sourceText = params.payload.text ?? "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldParse =
    parseMode === "always" ||
    (parseMode === "auto" &&
      (sourceText.includes("[[") ||
        sourceText.includes("MEDIA:") ||
        sourceText.includes(silentToken)));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = shouldParse
    ? parseReplyDirectives(sourceText, {
        currentMessageId: params.currentMessageId,
        silentToken,
      })
    : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let text = parsed ? parsed.text || undefined : params.payload.text || undefined;
  if (params.trimLeadingWhitespace && text) {
    text = text.trimStart() || undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaUrls = params.payload.mediaUrls ?? parsed?.mediaUrls;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaUrl = params.payload.mediaUrl ?? parsed?.mediaUrl ?? mediaUrls?.[0];

  return {
    payload: {
      ...params.payload,
      text,
      mediaUrls,
      mediaUrl,
      replyToId: params.payload.replyToId ?? parsed?.replyToId,
      replyToTag: params.payload.replyToTag || parsed?.replyToTag,
      replyToCurrent: params.payload.replyToCurrent || parsed?.replyToCurrent,
      audioAsVoice: Boolean(params.payload.audioAsVoice || parsed?.audioAsVoice),
    },
    isSilent: parsed?.isSilent ?? false,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hasRenderableMedia = (payload: ReplyPayload): boolean =>
  Boolean(payload.mediaUrl) || (payload.mediaUrls?.length ?? 0) > 0;

export function createBlockReplyDeliveryHandler(params: {
  onBlockReply: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  currentMessageId?: string;
  normalizeStreamingText: (payload: ReplyPayload) => { text?: string; skip: boolean };
  applyReplyToMode: (payload: ReplyPayload) => ReplyPayload;
  typingSignals: TypingSignaler;
  blockStreamingEnabled: boolean;
  blockReplyPipeline: BlockReplyPipeline | null;
  directlySentBlockKeys: Set<string>;
}): (payload: ReplyPayload) => Promise<void> {
  return async (payload) => {
    const { text, skip } = params.normalizeStreamingText(payload);
    if (skip && !hasRenderableMedia(payload)) {
      return;
    }

    const taggedPayload = applyReplyTagsToPayload(
      {
        ...payload,
        text,
        mediaUrl: payload.mediaUrl ?? payload.mediaUrls?.[0],
        replyToId:
          payload.replyToId ??
          (payload.replyToCurrent === false ? undefined : params.currentMessageId),
      },
      params.currentMessageId,
    );

    // Let through payloads with audioAsVoice flag even if empty (need to track it).
    if (!isRenderablePayload(taggedPayload) && !payload.audioAsVoice) {
      return;
    }

    const normalized = normalizeReplyPayloadDirectives({
      payload: taggedPayload,
      currentMessageId: params.currentMessageId,
      silentToken: SILENT_REPLY_TOKEN,
      trimLeadingWhitespace: true,
      parseMode: "auto",
    });

    const blockPayload = params.applyReplyToMode(normalized.payload);
    const blockHasMedia = hasRenderableMedia(blockPayload);

    // Skip empty payloads unless they have audioAsVoice flag (need to track it).
    if (!blockPayload.text && !blockHasMedia && !blockPayload.audioAsVoice) {
      return;
    }
    if (normalized.isSilent && !blockHasMedia) {
      return;
    }

    if (blockPayload.text) {
      void params.typingSignals.signalTextDelta(blockPayload.text).catch((err) => {
        logVerbose(`block reply typing signal failed: ${String(err)}`);
      });
    }

    // Use pipeline if available (block streaming enabled), otherwise send directly.
    if (params.blockStreamingEnabled && params.blockReplyPipeline) {
      params.blockReplyPipeline.enqueue(blockPayload);
    } else if (params.blockStreamingEnabled) {
      // Send directly when flushing before tool execution (no pipeline but streaming enabled).
      // Track sent key to avoid duplicate in final payloads.
      params.directlySentBlockKeys.add(createBlockReplyPayloadKey(blockPayload));
      await params.onBlockReply(blockPayload);
    }
    // When streaming is disabled entirely, blocks are accumulated in final text instead.
  };
}
