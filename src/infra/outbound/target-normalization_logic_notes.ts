/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/target-normalization.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin, normalizeChannelId } from "../../channels/plugins/index.js";
import type { ChannelId } from "../../channels/plugins/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeChannelTargetInput(raw: string): string {
  return raw.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeTargetForProvider(provider: string, raw?: string): string | undefined {
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerId = normalizeChannelId(provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = providerId ? getChannelPlugin(providerId) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = plugin?.messaging?.normalizeTarget?.(raw) ?? (raw.trim() || undefined);
  return normalized || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTargetResolverSignature(channel: ChannelId): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolver = plugin?.messaging?.targetResolver;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hint = resolver?.hint ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const looksLike = resolver?.looksLikeId;
  const source = looksLike ? looksLike.toString() : "";
  return hashSignature(`${hint}|${source}`);
}

function hashSignature(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
