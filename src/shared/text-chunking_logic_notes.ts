/*
 * AUTO ANNOTATION
 * File: src/shared/text-chunking.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function chunkTextByBreakResolver(
  text: string,
  limit: number,
  resolveBreakIndex: (window: string) => number,
): string[] {
  if (!text) {
    return [];
  }
  if (limit <= 0 || text.length <= limit) {
    return [text];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunks: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let remaining = text;
  while (remaining.length > limit) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const window = remaining.slice(0, limit);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidateBreak = resolveBreakIndex(window);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const breakIdx =
      Number.isFinite(candidateBreak) && candidateBreak > 0 && candidateBreak <= limit
        ? candidateBreak
        : limit;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rawChunk = remaining.slice(0, breakIdx);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunk = rawChunk.trimEnd();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
    remaining = remaining.slice(nextStart).trimStart();
  }
  if (remaining.length) {
    chunks.push(remaining);
  }
  return chunks;
}
