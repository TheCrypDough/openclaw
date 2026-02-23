/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/block-reply-coalescer.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyPayload } from "../types.js";
import type { BlockStreamingCoalescing } from "./block-streaming.js";

export type BlockReplyCoalescer = {
  enqueue: (payload: ReplyPayload) => void;
  flush: (options?: { force?: boolean }) => Promise<void>;
  hasBuffered: () => boolean;
  stop: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBlockReplyCoalescer(params: {
  config: BlockStreamingCoalescing;
  shouldAbort: () => boolean;
  onFlush: (payload: ReplyPayload) => Promise<void> | void;
}): BlockReplyCoalescer {
  const { config, shouldAbort, onFlush } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minChars = Math.max(1, Math.floor(config.minChars));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxChars = Math.max(minChars, Math.floor(config.maxChars));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idleMs = Math.max(0, Math.floor(config.idleMs));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const joiner = config.joiner ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const flushOnEnqueue = config.flushOnEnqueue === true;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let bufferText = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let bufferReplyToId: ReplyPayload["replyToId"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let bufferAudioAsVoice: ReplyPayload["audioAsVoice"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let idleTimer: NodeJS.Timeout | undefined;

  const clearIdleTimer = () => {
    if (!idleTimer) {
      return;
    }
    clearTimeout(idleTimer);
    idleTimer = undefined;
  };

  const resetBuffer = () => {
    bufferText = "";
    bufferReplyToId = undefined;
    bufferAudioAsVoice = undefined;
  };

  const scheduleIdleFlush = () => {
    if (idleMs <= 0) {
      return;
    }
    clearIdleTimer();
    idleTimer = setTimeout(() => {
      void flush({ force: false });
    }, idleMs);
  };

  const flush = async (options?: { force?: boolean }) => {
    clearIdleTimer();
    if (shouldAbort()) {
      resetBuffer();
      return;
    }
    if (!bufferText) {
      return;
    }
    if (!options?.force && !flushOnEnqueue && bufferText.length < minChars) {
      scheduleIdleFlush();
      return;
    }
    const payload: ReplyPayload = {
      text: bufferText,
      replyToId: bufferReplyToId,
      audioAsVoice: bufferAudioAsVoice,
    };
    resetBuffer();
    await onFlush(payload);
  };

  const enqueue = (payload: ReplyPayload) => {
    if (shouldAbort()) {
      return;
    }
    const hasMedia = Boolean(payload.mediaUrl) || (payload.mediaUrls?.length ?? 0) > 0;
    const text = payload.text ?? "";
    const hasText = text.trim().length > 0;
    if (hasMedia) {
      void flush({ force: true });
      void onFlush(payload);
      return;
    }
    if (!hasText) {
      return;
    }

    // When flushOnEnqueue is set (chunkMode="newline"), each enqueued payload is treated
    // as a separate paragraph and flushed immediately so delivery matches streaming boundaries.
    if (flushOnEnqueue) {
      if (bufferText) {
        void flush({ force: true });
      }
      bufferReplyToId = payload.replyToId;
      bufferAudioAsVoice = payload.audioAsVoice;
      bufferText = text;
      void flush({ force: true });
      return;
    }

    const replyToConflict = Boolean(
      bufferText &&
      payload.replyToId &&
      (!bufferReplyToId || bufferReplyToId !== payload.replyToId),
    );
    if (bufferText && (replyToConflict || bufferAudioAsVoice !== payload.audioAsVoice)) {
      void flush({ force: true });
    }

    if (!bufferText) {
      bufferReplyToId = payload.replyToId;
      bufferAudioAsVoice = payload.audioAsVoice;
    }

    const nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
    if (nextText.length > maxChars) {
      if (bufferText) {
        void flush({ force: true });
        bufferReplyToId = payload.replyToId;
        bufferAudioAsVoice = payload.audioAsVoice;
        if (text.length >= maxChars) {
          void onFlush(payload);
          return;
        }
        bufferText = text;
        scheduleIdleFlush();
        return;
      }
      void onFlush(payload);
      return;
    }

    bufferText = nextText;
    if (bufferText.length >= maxChars) {
      void flush({ force: true });
      return;
    }
    scheduleIdleFlush();
  };

  return {
    enqueue,
    flush,
    hasBuffered: () => Boolean(bufferText),
    stop: () => clearIdleTimer(),
  };
}
