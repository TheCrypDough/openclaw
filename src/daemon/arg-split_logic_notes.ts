/*
 * AUTO ANNOTATION
 * File: src/daemon/arg-split.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ArgSplitEscapeMode = "none" | "backslash" | "backslash-quote-only";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function splitArgsPreservingQuotes(
  value: string,
  options?: { escapeMode?: ArgSplitEscapeMode },
): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let inQuotes = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const escapeMode = options?.escapeMode ?? "none";

  for (let i = 0; i < value.length; i++) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const char = value[i];
    if (escapeMode === "backslash" && char === "\\") {
      if (i + 1 < value.length) {
        current += value[i + 1];
        i++;
      }
      continue;
    }
    if (
      escapeMode === "backslash-quote-only" &&
      char === "\\" &&
      i + 1 < value.length &&
      value[i + 1] === '"'
    ) {
      current += '"';
      i++;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && /\s/.test(char)) {
      if (current) {
        args.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (current) {
    args.push(current);
  }
  return args;
}
