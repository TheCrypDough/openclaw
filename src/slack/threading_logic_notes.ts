/*
 * AUTO ANNOTATION
 * File: src/slack/threading.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyToMode } from "../config/types.js";
import type { SlackAppMentionEvent, SlackMessageEvent } from "./types.js";

export type SlackThreadContext = {
  incomingThreadTs?: string;
  messageTs?: string;
  isThreadReply: boolean;
  replyToId?: string;
  messageThreadId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackThreadContext(params: {
  message: SlackMessageEvent | SlackAppMentionEvent;
  replyToMode: ReplyToMode;
}): SlackThreadContext {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const incomingThreadTs = params.message.thread_ts;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const eventTs = params.message.event_ts;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageTs = params.message.ts ?? eventTs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasThreadTs = typeof incomingThreadTs === "string" && incomingThreadTs.length > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isThreadReply =
    hasThreadTs && (incomingThreadTs !== messageTs || Boolean(params.message.parent_user_id));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyToId = incomingThreadTs ?? messageTs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageThreadId = isThreadReply
    ? incomingThreadTs
    : params.replyToMode === "all"
      ? messageTs
      : undefined;
  return {
    incomingThreadTs,
    messageTs,
    isThreadReply,
    replyToId,
    messageThreadId,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackThreadTargets(params: {
  message: SlackMessageEvent | SlackAppMentionEvent;
  replyToMode: ReplyToMode;
}) {
  const { incomingThreadTs, messageTs } = resolveSlackThreadContext(params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyThreadTs = incomingThreadTs ?? (params.replyToMode === "all" ? messageTs : undefined);
  const statusThreadTs = replyThreadTs ?? messageTs;
  return { replyThreadTs, statusThreadTs };
}
