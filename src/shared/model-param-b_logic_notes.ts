/*
 * AUTO ANNOTATION
 * File: src/shared/model-param-b.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function inferParamBFromIdOrName(text: string): number | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = text.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matches = raw.matchAll(/(?:^|[^a-z0-9])[a-z]?(\d+(?:\.\d+)?)b(?:[^a-z0-9]|$)/g);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let best: number | null = null;
  for (const match of matches) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const numRaw = match[1];
    if (!numRaw) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = Number(numRaw);
    if (!Number.isFinite(value) || value <= 0) {
      continue;
    }
    if (best === null || value > best) {
      best = value;
    }
  }
  return best;
}
