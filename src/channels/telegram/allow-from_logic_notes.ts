/*
 * AUTO ANNOTATION
 * File: src/channels/telegram/allow-from.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeTelegramAllowFromEntry(raw: unknown): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = typeof raw === "string" ? raw : typeof raw === "number" ? String(raw) : "";
  return base
    .trim()
    .replace(/^(telegram|tg):/i, "")
    .trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isNumericTelegramUserId(raw: string): boolean {
  return /^-?\d+$/.test(raw);
}
