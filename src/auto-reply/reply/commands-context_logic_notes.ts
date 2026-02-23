/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import { resolveCommandAuthorization } from "../command-auth.js";
import { normalizeCommandBody } from "../commands-registry.js";
import type { MsgContext } from "../templating.js";
import type { CommandContext } from "./commands-types.js";
import { stripMentions } from "./mentions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCommandContext(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  isGroup: boolean;
  triggerBodyNormalized: string;
  commandAuthorized: boolean;
}): CommandContext {
  const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const auth = resolveCommandAuthorization({
    ctx,
    cfg,
    commandAuthorized: params.commandAuthorized,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const surface = (ctx.Surface ?? ctx.Provider ?? "").trim().toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channel = (ctx.Provider ?? surface).trim().toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abortKey = sessionKey ?? (auth.from || undefined) ?? (auth.to || undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawBodyNormalized = triggerBodyNormalized;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandBodyNormalized = normalizeCommandBody(
    isGroup ? stripMentions(rawBodyNormalized, ctx, cfg, agentId) : rawBodyNormalized,
  );

  return {
    surface,
    channel,
    channelId: auth.providerId,
    ownerList: auth.ownerList,
    senderIsOwner: auth.senderIsOwner,
    isAuthorizedSender: auth.isAuthorizedSender,
    senderId: auth.senderId,
    abortKey,
    rawBodyNormalized,
    commandBodyNormalized,
    from: auth.from,
    to: auth.to,
  };
}
