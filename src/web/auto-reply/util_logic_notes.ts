/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/util.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function elide(text?: string, limit = 400) {
  if (!text) {
    return text;
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}… (truncated ${text.length - limit} chars)`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isLikelyWhatsAppCryptoError(reason: unknown) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatReason = (value: unknown): string => {
    if (value == null) {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    if (value instanceof Error) {
      return `${value.message}\n${value.stack ?? ""}`;
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return Object.prototype.toString.call(value);
      }
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (typeof value === "boolean") {
      return String(value);
    }
    if (typeof value === "bigint") {
      return String(value);
    }
    if (typeof value === "symbol") {
      return value.description ?? value.toString();
    }
    if (typeof value === "function") {
      return value.name ? `[function ${value.name}]` : "[function]";
    }
    return Object.prototype.toString.call(value);
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw =
    reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : formatReason(reason);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const haystack = raw.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasAuthError =
    haystack.includes("unsupported state or unable to authenticate data") ||
    haystack.includes("bad mac");
  if (!hasAuthError) {
    return false;
  }
  return (
    haystack.includes("@whiskeysockets/baileys") ||
    haystack.includes("baileys") ||
    haystack.includes("noise-handler") ||
    haystack.includes("aesdecryptgcm")
  );
}
