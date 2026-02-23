/*
 * AUTO ANNOTATION
 * File: src/slack/draft-stream.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createDraftStreamLoop } from "../channels/draft-stream-loop.js";
import { deleteSlackMessage, editSlackMessage } from "./actions.js";
import { sendMessageSlack } from "./send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SLACK_STREAM_MAX_CHARS = 4000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_THROTTLE_MS = 1000;

export type SlackDraftStream = {
  update: (text: string) => void;
  flush: () => Promise<void>;
  clear: () => Promise<void>;
  stop: () => void;
  forceNewMessage: () => void;
  messageId: () => string | undefined;
  channelId: () => string | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSlackDraftStream(params: {
  target: string;
  token: string;
  accountId?: string;
  maxChars?: number;
  throttleMs?: number;
  resolveThreadTs?: () => string | undefined;
  onMessageSent?: () => void;
  log?: (message: string) => void;
  warn?: (message: string) => void;
  send?: typeof sendMessageSlack;
  edit?: typeof editSlackMessage;
  remove?: typeof deleteSlackMessage;
}): SlackDraftStream {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxChars = Math.min(params.maxChars ?? SLACK_STREAM_MAX_CHARS, SLACK_STREAM_MAX_CHARS);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const send = params.send ?? sendMessageSlack;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const edit = params.edit ?? editSlackMessage;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remove = params.remove ?? deleteSlackMessage;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let streamMessageId: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let streamChannelId: string | undefined;
  let lastSentText = "";
  let stopped = false;

  const sendOrEditStreamMessage = async (text: string) => {
    if (stopped) {
      return;
    }
    const trimmed = text.trimEnd();
    if (!trimmed) {
      return;
    }
    if (trimmed.length > maxChars) {
      stopped = true;
      params.warn?.(`slack stream preview stopped (text length ${trimmed.length} > ${maxChars})`);
      return;
    }
    if (trimmed === lastSentText) {
      return;
    }
    lastSentText = trimmed;
    try {
      if (streamChannelId && streamMessageId) {
        await edit(streamChannelId, streamMessageId, trimmed, {
          token: params.token,
          accountId: params.accountId,
        });
        return;
      }
      const sent = await send(params.target, trimmed, {
        token: params.token,
        accountId: params.accountId,
        threadTs: params.resolveThreadTs?.(),
      });
      streamChannelId = sent.channelId || streamChannelId;
      streamMessageId = sent.messageId || streamMessageId;
      if (!streamChannelId || !streamMessageId) {
        stopped = true;
        params.warn?.("slack stream preview stopped (missing identifiers from sendMessage)");
        return;
      }
      params.onMessageSent?.();
    } catch (err) {
      stopped = true;
      params.warn?.(
        `slack stream preview failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };
  const loop = createDraftStreamLoop({
    throttleMs,
    isStopped: () => stopped,
    sendOrEditStreamMessage,
  });

  const stop = () => {
    stopped = true;
    loop.stop();
  };

  const clear = async () => {
    stop();
    await loop.waitForInFlight();
    const channelId = streamChannelId;
    const messageId = streamMessageId;
    streamChannelId = undefined;
    streamMessageId = undefined;
    lastSentText = "";
    if (!channelId || !messageId) {
      return;
    }
    try {
      await remove(channelId, messageId, {
        token: params.token,
        accountId: params.accountId,
      });
    } catch (err) {
      params.warn?.(
        `slack stream preview cleanup failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const forceNewMessage = () => {
    streamMessageId = undefined;
    streamChannelId = undefined;
    lastSentText = "";
    loop.resetPending();
  };

  params.log?.(`slack stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);

  return {
    update: loop.update,
    flush: loop.flush,
    clear,
    stop,
    forceNewMessage,
    messageId: () => streamMessageId,
    channelId: () => streamChannelId,
  };
}
