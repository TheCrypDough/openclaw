/*
 * AUTO ANNOTATION
 * File: src/media-understanding/output-extract.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractLastJsonObject(raw: string): unknown {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = trimmed.lastIndexOf("{");
  if (start === -1) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slice = trimmed.slice(start);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractGeminiResponse(raw: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = extractLastJsonObject(raw);
  if (!payload || typeof payload !== "object") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const response = (payload as { response?: unknown }).response;
  if (typeof response !== "string") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = response.trim();
  return trimmed || null;
}
