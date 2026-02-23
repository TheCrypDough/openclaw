/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isStatusCommand(body: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = body.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }
  return trimmed === "/status" || trimmed === "status" || trimmed.startsWith("/status ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripMentionsForCommand(
  text: string,
  mentionRegexes: RegExp[],
  selfE164?: string | null,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let result = text;
  for (const re of mentionRegexes) {
    result = result.replace(re, " ");
  }
  if (selfE164) {
    // `selfE164` is usually like "+1234"; strip down to digits so we can match "+?1234" safely.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const digits = selfE164.replace(/\D/g, "");
    if (digits) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const pattern = new RegExp(`\\+?${digits}`, "g");
      result = result.replace(pattern, " ");
    }
  }
  return result.replace(/\s+/g, " ").trim();
}
