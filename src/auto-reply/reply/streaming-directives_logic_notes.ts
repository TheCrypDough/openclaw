/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/streaming-directives.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { splitMediaFromOutput } from "../../media/parse.js";
import { parseInlineDirectives } from "../../utils/directive-tags.js";
import { isSilentReplyText, SILENT_REPLY_TOKEN } from "../tokens.js";
import type { ReplyDirectiveParseResult } from "./reply-directives.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PendingReplyState = {
  explicitId?: string;
  sawCurrent: boolean;
  hasTag: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ParsedChunk = ReplyDirectiveParseResult & {
  replyToExplicitId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConsumeOptions = {
  final?: boolean;
  silentToken?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const splitTrailingDirective = (text: string): { text: string; tail: string } => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const openIndex = text.lastIndexOf("[[");
  if (openIndex < 0) {
    return { text, tail: "" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const closeIndex = text.indexOf("]]", openIndex + 2);
  if (closeIndex >= 0) {
    return { text, tail: "" };
  }
  return {
    text: text.slice(0, openIndex),
    tail: text.slice(openIndex),
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const parseChunk = (raw: string, options?: { silentToken?: string }): ParsedChunk => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const split = splitMediaFromOutput(raw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let text = split.text ?? "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyParsed = parseInlineDirectives(text, {
    stripAudioTag: false,
    stripReplyTags: true,
  });

  if (replyParsed.hasReplyTag) {
    text = replyParsed.text;
  }

  const silentToken = options?.silentToken ?? SILENT_REPLY_TOKEN;
  const isSilent = isSilentReplyText(text, silentToken);
  if (isSilent) {
    text = "";
  }

  return {
    text,
    mediaUrls: split.mediaUrls,
    mediaUrl: split.mediaUrl,
    replyToId: replyParsed.replyToId,
    replyToExplicitId: replyParsed.replyToExplicitId,
    replyToCurrent: replyParsed.replyToCurrent,
    replyToTag: replyParsed.hasReplyTag,
    audioAsVoice: split.audioAsVoice,
    isSilent,
  };
};

const hasRenderableContent = (parsed: ReplyDirectiveParseResult): boolean =>
  Boolean(parsed.text) ||
  Boolean(parsed.mediaUrl) ||
  (parsed.mediaUrls?.length ?? 0) > 0 ||
  Boolean(parsed.audioAsVoice);

export function createStreamingDirectiveAccumulator() {
  let pendingTail = "";
  let pendingReply: PendingReplyState = { sawCurrent: false, hasTag: false };
  let activeReply: PendingReplyState = { sawCurrent: false, hasTag: false };

  const reset = () => {
    pendingTail = "";
    pendingReply = { sawCurrent: false, hasTag: false };
    activeReply = { sawCurrent: false, hasTag: false };
  };

  const consume = (raw: string, options: ConsumeOptions = {}): ReplyDirectiveParseResult | null => {
    let combined = `${pendingTail}${raw ?? ""}`;
    pendingTail = "";

    if (!options.final) {
      const split = splitTrailingDirective(combined);
      combined = split.text;
      pendingTail = split.tail;
    }

    if (!combined) {
      return null;
    }

    const parsed = parseChunk(combined, { silentToken: options.silentToken });
    const hasTag = activeReply.hasTag || pendingReply.hasTag || parsed.replyToTag;
    const sawCurrent = activeReply.sawCurrent || pendingReply.sawCurrent || parsed.replyToCurrent;
    const explicitId =
      parsed.replyToExplicitId ?? pendingReply.explicitId ?? activeReply.explicitId;

    const combinedResult: ReplyDirectiveParseResult = {
      ...parsed,
      replyToId: explicitId,
      replyToCurrent: sawCurrent,
      replyToTag: hasTag,
    };

    if (!hasRenderableContent(combinedResult)) {
      if (hasTag) {
        pendingReply = {
          explicitId,
          sawCurrent,
          hasTag,
        };
      }
      return null;
    }

    // Keep reply context sticky for the full assistant message so split/newline chunks
    // stay on the same native reply target until reset() is called for the next message.
    activeReply = {
      explicitId,
      sawCurrent,
      hasTag,
    };
    pendingReply = { sawCurrent: false, hasTag: false };
    return combinedResult;
  };

  return {
    consume,
    reset,
  };
}
