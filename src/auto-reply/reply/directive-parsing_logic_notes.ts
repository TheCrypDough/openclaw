/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/directive-parsing.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function skipDirectiveArgPrefix(raw: string): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let i = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const len = raw.length;
  while (i < len && /\s/.test(raw[i])) {
    i += 1;
  }
  if (raw[i] === ":") {
    i += 1;
    while (i < len && /\s/.test(raw[i])) {
      i += 1;
    }
  }
  return i;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function takeDirectiveToken(
  raw: string,
  startIndex: number,
): { token: string | null; nextIndex: number } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let i = startIndex;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const len = raw.length;
  while (i < len && /\s/.test(raw[i])) {
    i += 1;
  }
  if (i >= len) {
    return { token: null, nextIndex: i };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = i;
  while (i < len && !/\s/.test(raw[i])) {
    i += 1;
  }
  if (start === i) {
    return { token: null, nextIndex: i };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = raw.slice(start, i);
  while (i < len && /\s/.test(raw[i])) {
    i += 1;
  }
  return { token, nextIndex: i };
}
