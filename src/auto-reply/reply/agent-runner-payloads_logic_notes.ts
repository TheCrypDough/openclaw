/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/agent-runner-payloads.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyToMode } from "../../config/types.js";
import { logVerbose } from "../../globals.js";
import { stripHeartbeatToken } from "../heartbeat.js";
import type { OriginatingChannelType } from "../templating.js";
import { SILENT_REPLY_TOKEN } from "../tokens.js";
import type { ReplyPayload } from "../types.js";
import { formatBunFetchSocketError, isBunFetchSocketError } from "./agent-runner-utils.js";
import { createBlockReplyPayloadKey, type BlockReplyPipeline } from "./block-reply-pipeline.js";
import { normalizeReplyPayloadDirectives } from "./reply-delivery.js";
import {
  applyReplyThreading,
  filterMessagingToolDuplicates,
  filterMessagingToolMediaDuplicates,
  isRenderablePayload,
  shouldSuppressMessagingToolReplies,
} from "./reply-payloads.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildReplyPayloads(params: {
  payloads: ReplyPayload[];
  isHeartbeat: boolean;
  didLogHeartbeatStrip: boolean;
  blockStreamingEnabled: boolean;
  blockReplyPipeline: BlockReplyPipeline | null;
  /** Payload keys sent directly (not via pipeline) during tool flush. */
  directlySentBlockKeys?: Set<string>;
  replyToMode: ReplyToMode;
  replyToChannel?: OriginatingChannelType;
  currentMessageId?: string;
  messageProvider?: string;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: Parameters<
    typeof shouldSuppressMessagingToolReplies
  >[0]["messagingToolSentTargets"];
  originatingTo?: string;
  accountId?: string;
}): { replyPayloads: ReplyPayload[]; didLogHeartbeatStrip: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let didLogHeartbeatStrip = params.didLogHeartbeatStrip;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sanitizedPayloads = params.isHeartbeat
    ? params.payloads
    : params.payloads.flatMap((payload) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        let text = payload.text;

        if (payload.isError && text && isBunFetchSocketError(text)) {
          text = formatBunFetchSocketError(text);
        }

        if (!text || !text.includes("HEARTBEAT_OK")) {
          return [{ ...payload, text }];
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const stripped = stripHeartbeatToken(text, { mode: "message" });
        if (stripped.didStrip && !didLogHeartbeatStrip) {
          didLogHeartbeatStrip = true;
          logVerbose("Stripped stray HEARTBEAT_OK token from reply");
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const hasMedia = Boolean(payload.mediaUrl) || (payload.mediaUrls?.length ?? 0) > 0;
        if (stripped.shouldSkip && !hasMedia) {
          return [];
        }
        return [{ ...payload, text: stripped.text }];
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyTaggedPayloads: ReplyPayload[] = applyReplyThreading({
    payloads: sanitizedPayloads,
    replyToMode: params.replyToMode,
    replyToChannel: params.replyToChannel,
    currentMessageId: params.currentMessageId,
  })
    .map(
      (payload) =>
        normalizeReplyPayloadDirectives({
          payload,
          currentMessageId: params.currentMessageId,
          silentToken: SILENT_REPLY_TOKEN,
          parseMode: "always",
        }).payload,
    )
    .filter(isRenderablePayload);

  // Drop final payloads only when block streaming succeeded end-to-end.
  // If streaming aborted (e.g., timeout), fall back to final payloads.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldDropFinalPayloads =
    params.blockStreamingEnabled &&
    Boolean(params.blockReplyPipeline?.didStream()) &&
    !params.blockReplyPipeline?.isAborted();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messagingToolSentTexts = params.messagingToolSentTexts ?? [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messagingToolSentTargets = params.messagingToolSentTargets ?? [];
  const suppressMessagingToolReplies = shouldSuppressMessagingToolReplies({
    messageProvider: params.messageProvider,
    messagingToolSentTargets,
    originatingTo: params.originatingTo,
    accountId: params.accountId,
  });
  const dedupedPayloads = filterMessagingToolDuplicates({
    payloads: replyTaggedPayloads,
    sentTexts: messagingToolSentTexts,
  });
  const mediaFilteredPayloads = filterMessagingToolMediaDuplicates({
    payloads: dedupedPayloads,
    sentMediaUrls: params.messagingToolSentMediaUrls ?? [],
  });
  // Filter out payloads already sent via pipeline or directly during tool flush.
  const filteredPayloads = shouldDropFinalPayloads
    ? []
    : params.blockStreamingEnabled
      ? mediaFilteredPayloads.filter(
          (payload) => !params.blockReplyPipeline?.hasSentPayload(payload),
        )
      : params.directlySentBlockKeys?.size
        ? mediaFilteredPayloads.filter(
            (payload) => !params.directlySentBlockKeys!.has(createBlockReplyPayloadKey(payload)),
          )
        : mediaFilteredPayloads;
  const replyPayloads = suppressMessagingToolReplies ? [] : filteredPayloads;

  return {
    replyPayloads,
    didLogHeartbeatStrip,
  };
}
