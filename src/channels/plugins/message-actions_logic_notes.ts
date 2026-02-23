/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/message-actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
import { getChannelPlugin, listChannelPlugins } from "./index.js";
import type { ChannelMessageActionContext, ChannelMessageActionName } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const trustedRequesterRequiredByChannel: Readonly<
  Partial<Record<string, ReadonlySet<ChannelMessageActionName>>>
> = {
  discord: new Set<ChannelMessageActionName>(["timeout", "kick", "ban"]),
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function requiresTrustedRequesterSender(ctx: ChannelMessageActionContext): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actions = trustedRequesterRequiredByChannel[ctx.channel];
  return Boolean(actions?.has(ctx.action) && ctx.toolContext);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listChannelMessageActions(cfg: OpenClawConfig): ChannelMessageActionName[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actions = new Set<ChannelMessageActionName>(["send", "broadcast"]);
  for (const plugin of listChannelPlugins()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const list = plugin.actions?.listActions?.({ cfg });
    if (!list) {
      continue;
    }
    for (const action of list) {
      actions.add(action);
    }
  }
  return Array.from(actions);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function supportsChannelMessageButtons(cfg: OpenClawConfig): boolean {
  for (const plugin of listChannelPlugins()) {
    if (plugin.actions?.supportsButtons?.({ cfg })) {
      return true;
    }
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function supportsChannelMessageButtonsForChannel(params: {
  cfg: OpenClawConfig;
  channel?: string;
}): boolean {
  if (!params.channel) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(params.channel as Parameters<typeof getChannelPlugin>[0]);
  return plugin?.actions?.supportsButtons?.({ cfg: params.cfg }) === true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function supportsChannelMessageCards(cfg: OpenClawConfig): boolean {
  for (const plugin of listChannelPlugins()) {
    if (plugin.actions?.supportsCards?.({ cfg })) {
      return true;
    }
  }
  return false;
}

export function supportsChannelMessageCardsForChannel(params: {
  cfg: OpenClawConfig;
  channel?: string;
}): boolean {
  if (!params.channel) {
    return false;
  }
  const plugin = getChannelPlugin(params.channel as Parameters<typeof getChannelPlugin>[0]);
  return plugin?.actions?.supportsCards?.({ cfg: params.cfg }) === true;
}

export async function dispatchChannelMessageAction(
  ctx: ChannelMessageActionContext,
): Promise<AgentToolResult<unknown> | null> {
  if (requiresTrustedRequesterSender(ctx) && !ctx.requesterSenderId?.trim()) {
    throw new Error(
      `Trusted sender identity is required for ${ctx.channel}:${ctx.action} in tool-driven contexts.`,
    );
  }
  const plugin = getChannelPlugin(ctx.channel);
  if (!plugin?.actions?.handleAction) {
    return null;
  }
  if (plugin.actions.supportsAction && !plugin.actions.supportsAction({ action: ctx.action })) {
    return null;
  }
  return await plugin.actions.handleAction(ctx);
}
