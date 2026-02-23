/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/identity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentAvatar } from "../../agents/identity-avatar.js";
import { resolveAgentIdentity } from "../../agents/identity.js";
import type { OpenClawConfig } from "../../config/config.js";

export type OutboundIdentity = {
  name?: string;
  avatarUrl?: string;
  emoji?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeOutboundIdentity(
  identity?: OutboundIdentity | null,
): OutboundIdentity | undefined {
  if (!identity) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = identity.name?.trim() || undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const avatarUrl = identity.avatarUrl?.trim() || undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emoji = identity.emoji?.trim() || undefined;
  if (!name && !avatarUrl && !emoji) {
    return undefined;
  }
  return { name, avatarUrl, emoji };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAgentOutboundIdentity(
  cfg: OpenClawConfig,
  agentId: string,
): OutboundIdentity | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentIdentity = resolveAgentIdentity(cfg, agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const avatar = resolveAgentAvatar(cfg, agentId);
  return normalizeOutboundIdentity({
    name: agentIdentity?.name,
    emoji: agentIdentity?.emoji,
    avatarUrl: avatar.kind === "remote" ? avatar.url : undefined,
  });
}
