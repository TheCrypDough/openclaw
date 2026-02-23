/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.api-key.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_KEY_PREVIEW = { head: 4, tail: 4 };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeApiKeyInput(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return "";
  }

  // Handle shell-style assignments: export KEY="value" or KEY=value
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const assignmentMatch = trimmed.match(/^(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.+)$/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const valuePart = assignmentMatch ? assignmentMatch[1].trim() : trimmed;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unquoted =
    valuePart.length >= 2 &&
    ((valuePart.startsWith('"') && valuePart.endsWith('"')) ||
      (valuePart.startsWith("'") && valuePart.endsWith("'")) ||
      (valuePart.startsWith("`") && valuePart.endsWith("`")))
      ? valuePart.slice(1, -1)
      : valuePart;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutSemicolon = unquoted.endsWith(";") ? unquoted.slice(0, -1) : unquoted;

  return withoutSemicolon.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const validateApiKeyInput = (value: string) =>
  normalizeApiKeyInput(value).length > 0 ? undefined : "Required";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatApiKeyPreview(
  raw: string,
  opts: { head?: number; tail?: number } = {},
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return "…";
  }
  const head = opts.head ?? DEFAULT_KEY_PREVIEW.head;
  const tail = opts.tail ?? DEFAULT_KEY_PREVIEW.tail;
  if (trimmed.length <= head + tail) {
    const shortHead = Math.min(2, trimmed.length);
    const shortTail = Math.min(2, trimmed.length - shortHead);
    if (shortTail <= 0) {
      return `${trimmed.slice(0, shortHead)}…`;
    }
    return `${trimmed.slice(0, shortHead)}…${trimmed.slice(-shortTail)}`;
  }
  return `${trimmed.slice(0, head)}…${trimmed.slice(-tail)}`;
}
