/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/reply-threading.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelDock } from "../../channels/dock.js";
import { normalizeChannelId } from "../../channels/plugins/index.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { ReplyToMode } from "../../config/types.js";
import type { OriginatingChannelType } from "../templating.js";
import type { ReplyPayload } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveReplyToMode(
  cfg: OpenClawConfig,
  channel?: OriginatingChannelType,
  accountId?: string | null,
  chatType?: string | null,
): ReplyToMode {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeChannelId(channel);
  if (!provider) {
    return "all";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = getChannelDock(provider)?.threading?.resolveReplyToMode?.({
    cfg,
    accountId,
    chatType,
  });
  return resolved ?? "all";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createReplyToModeFilter(
  mode: ReplyToMode,
  opts: { allowExplicitReplyTagsWhenOff?: boolean } = {},
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasThreaded = false;
  return (payload: ReplyPayload): ReplyPayload => {
    if (!payload.replyToId) {
      return payload;
    }
    if (mode === "off") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const isExplicit = Boolean(payload.replyToTag) || Boolean(payload.replyToCurrent);
      if (opts.allowExplicitReplyTagsWhenOff && isExplicit) {
        return payload;
      }
      return { ...payload, replyToId: undefined };
    }
    if (mode === "all") {
      return payload;
    }
    if (hasThreaded) {
      return { ...payload, replyToId: undefined };
    }
    hasThreaded = true;
    return payload;
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createReplyToModeFilterForChannel(
  mode: ReplyToMode,
  channel?: OriginatingChannelType,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeChannelId(channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = typeof channel === "string" ? channel.trim().toLowerCase() : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isWebchat = normalized === "webchat";
  // Default: allow explicit reply tags/directives even when replyToMode is "off".
  // Unknown channels fail closed; internal webchat stays allowed.
  const dock = provider ? getChannelDock(provider) : undefined;
  const allowExplicitReplyTagsWhenOff = provider
    ? (dock?.threading?.allowExplicitReplyTagsWhenOff ?? dock?.threading?.allowTagsWhenOff ?? true)
    : isWebchat;
  return createReplyToModeFilter(mode, {
    allowExplicitReplyTagsWhenOff,
  });
}
