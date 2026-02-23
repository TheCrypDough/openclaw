/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/normalize/whatsapp.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeWhatsAppTarget } from "../../../whatsapp/normalize.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeWhatsAppMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  return normalizeWhatsAppTarget(trimmed) ?? undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeWhatsAppTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^whatsapp:/i.test(trimmed)) {
    return true;
  }
  if (trimmed.includes("@")) {
    return true;
  }
  return /^\+?\d{3,}$/.test(trimmed);
}
