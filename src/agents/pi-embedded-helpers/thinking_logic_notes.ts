/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-helpers/thinking.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeThinkLevel, type ThinkLevel } from "../../auto-reply/thinking.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractSupportedValues(raw: string): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match =
    raw.match(/supported values are:\s*([^\n.]+)/i) ?? raw.match(/supported values:\s*([^\n.]+)/i);
  if (!match?.[1]) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fragment = match[1];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const quoted = Array.from(fragment.matchAll(/['"]([^'"]+)['"]/g)).map((entry) =>
    entry[1]?.trim(),
  );
  if (quoted.length > 0) {
    return quoted.filter((entry): entry is string => Boolean(entry));
  }
  return fragment
    .split(/,|\band\b/gi)
    .map((entry) => entry.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").trim())
    .filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pickFallbackThinkingLevel(params: {
  message?: string;
  attempted: Set<ThinkLevel>;
}): ThinkLevel | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = params.message?.trim();
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const supported = extractSupportedValues(raw);
  if (supported.length === 0) {
    return undefined;
  }
  for (const entry of supported) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeThinkLevel(entry);
    if (!normalized) {
      continue;
    }
    if (params.attempted.has(normalized)) {
      continue;
    }
    return normalized;
  }
  return undefined;
}
