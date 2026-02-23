/*
 * AUTO ANNOTATION
 * File: src/agents/pty-dsr.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ESC = String.fromCharCode(0x1b);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DSR_PATTERN = new RegExp(`${ESC}\\[\\??6n`, "g");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripDsrRequests(input: string): { cleaned: string; requests: number } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let requests = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = input.replace(DSR_PATTERN, () => {
    requests += 1;
    return "";
  });
  return { cleaned, requests };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCursorPositionResponse(row = 1, col = 1): string {
  return `\x1b[${row};${col}R`;
}
