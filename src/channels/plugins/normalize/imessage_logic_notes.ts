/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/normalize/imessage.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeIMessageHandle } from "../../../imessage/targets.js";

// Service prefixes that indicate explicit delivery method; must be preserved during normalization
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SERVICE_PREFIXES = ["imessage:", "sms:", "auto:"] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CHAT_TARGET_PREFIX_RE =
  /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeIMessageMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

  // Preserve service prefix if present (e.g., "sms:+1555" → "sms:+15551234567")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = trimmed.toLowerCase();
  for (const prefix of SERVICE_PREFIXES) {
    if (lower.startsWith(prefix)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const remainder = trimmed.slice(prefix.length).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalizedHandle = normalizeIMessageHandle(remainder);
      if (!normalizedHandle) {
        return undefined;
      }
      if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) {
        return normalizedHandle;
      }
      return `${prefix}${normalizedHandle}`;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeIMessageHandle(trimmed);
  return normalized || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeIMessageTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^(imessage:|sms:|auto:)/i.test(trimmed)) {
    return true;
  }
  if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
    return true;
  }
  if (trimmed.includes("@")) {
    return true;
  }
  return /^\+?\d{3,}$/.test(trimmed);
}
