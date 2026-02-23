/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/outbound/signal.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { chunkText } from "../../../auto-reply/chunk.js";
import { sendMessageSignal } from "../../../signal/send.js";
import { resolveChannelMediaMaxBytes } from "../media-limits.js";
import type { ChannelOutboundAdapter } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveSignalMaxBytes(params: {
  cfg: Parameters<typeof resolveChannelMediaMaxBytes>[0]["cfg"];
  accountId?: string | null;
}) {
  return resolveChannelMediaMaxBytes({
    cfg: params.cfg,
    resolveChannelLimitMb: ({ cfg, accountId }) =>
      cfg.channels?.signal?.accounts?.[accountId]?.mediaMaxMb ?? cfg.channels?.signal?.mediaMaxMb,
    accountId: params.accountId,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const signalOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: chunkText,
  chunkerMode: "text",
  textChunkLimit: 4000,
  sendText: async ({ cfg, to, text, accountId, deps }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send = deps?.sendSignal ?? sendMessageSignal;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const maxBytes = resolveSignalMaxBytes({ cfg, accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text, {
      maxBytes,
      accountId: accountId ?? undefined,
    });
    return { channel: "signal", ...result };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, accountId, deps }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send = deps?.sendSignal ?? sendMessageSignal;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const maxBytes = resolveSignalMaxBytes({ cfg, accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text, {
      mediaUrl,
      maxBytes,
      accountId: accountId ?? undefined,
      mediaLocalRoots,
    });
    return { channel: "signal", ...result };
  },
};
