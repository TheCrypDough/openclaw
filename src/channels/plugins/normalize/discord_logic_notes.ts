/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/normalize/discord.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseDiscordTarget } from "../../../discord/targets.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDiscordMessagingTarget(raw: string): string | undefined {
  // Default bare IDs to channels so routing is stable across tool actions.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = parseDiscordTarget(raw, { defaultKind: "channel" });
  return target?.normalized;
}

/**
 * Normalize a Discord outbound target for delivery. Bare numeric IDs are
 * prefixed with "channel:" to avoid the ambiguous-target error in
 * parseDiscordTarget. All other formats pass through unchanged.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDiscordOutboundTarget(
  to?: string,
): { ok: true; to: string } | { ok: false; error: Error } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = to?.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: new Error(
        'Discord recipient is required. Use "channel:<id>" for channels or "user:<id>" for DMs.',
      ),
    };
  }
  if (/^\d+$/.test(trimmed)) {
    return { ok: true, to: `channel:${trimmed}` };
  }
  return { ok: true, to: trimmed };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeDiscordTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^<@!?\d+>$/.test(trimmed)) {
    return true;
  }
  if (/^(user|channel|discord):/i.test(trimmed)) {
    return true;
  }
  if (/^\d{6,}$/.test(trimmed)) {
    return true;
  }
  return false;
}
