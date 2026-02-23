/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/send/formatting.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getMatrixRuntime } from "../../runtime.js";
import { markdownToMatrixHtml } from "../format.js";
import {
  MsgType,
  RelationType,
  type MatrixFormattedContent,
  type MatrixMediaMsgType,
  type MatrixRelation,
  type MatrixReplyRelation,
  type MatrixTextContent,
  type MatrixThreadRelation,
} from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getCore = () => getMatrixRuntime();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTextContent(body: string, relation?: MatrixRelation): MatrixTextContent {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const content: MatrixTextContent = relation
    ? {
        msgtype: MsgType.Text,
        body,
        "m.relates_to": relation,
      }
    : {
        msgtype: MsgType.Text,
        body,
      };
  applyMatrixFormatting(content, body);
  return content;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyMatrixFormatting(content: MatrixFormattedContent, body: string): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatted = markdownToMatrixHtml(body ?? "");
  if (!formatted) {
    return;
  }
  content.format = "org.matrix.custom.html";
  content.formatted_body = formatted;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildReplyRelation(replyToId?: string): MatrixReplyRelation | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = replyToId?.trim();
  if (!trimmed) {
    return undefined;
  }
  return { "m.in_reply_to": { event_id: trimmed } };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildThreadRelation(threadId: string, replyToId?: string): MatrixThreadRelation {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = threadId.trim();
  return {
    rel_type: RelationType.Thread,
    event_id: trimmed,
    is_falling_back: true,
    "m.in_reply_to": { event_id: replyToId?.trim() || trimmed },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMatrixMsgType(contentType?: string, _fileName?: string): MatrixMediaMsgType {
  const kind = getCore().media.mediaKindFromMime(contentType ?? "");
  switch (kind) {
    case "image":
      return MsgType.Image;
    case "audio":
      return MsgType.Audio;
    case "video":
      return MsgType.Video;
    default:
      return MsgType.File;
  }
}

export function resolveMatrixVoiceDecision(opts: {
  wantsVoice: boolean;
  contentType?: string;
  fileName?: string;
}): { useVoice: boolean } {
  if (!opts.wantsVoice) {
    return { useVoice: false };
  }
  if (isMatrixVoiceCompatibleAudio(opts)) {
    return { useVoice: true };
  }
  return { useVoice: false };
}

function isMatrixVoiceCompatibleAudio(opts: { contentType?: string; fileName?: string }): boolean {
  // Matrix currently shares the core voice compatibility policy.
  // Keep this wrapper as the seam if Matrix policy diverges later.
  return getCore().media.isVoiceCompatibleAudio({
    contentType: opts.contentType,
    fileName: opts.fileName,
  });
}
