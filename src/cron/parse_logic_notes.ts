/*
 * AUTO ANNOTATION
 * File: src/cron/parse.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ISO_TZ_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeUtcIso(raw: string) {
  if (ISO_TZ_RE.test(raw)) {
    return raw;
  }
  if (ISO_DATE_RE.test(raw)) {
    return `${raw}T00:00:00Z`;
  }
  if (ISO_DATE_TIME_RE.test(raw)) {
    return `${raw}Z`;
  }
  return raw;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseAbsoluteTimeMs(input: string): number | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = input.trim();
  if (!raw) {
    return null;
  }
  if (/^\d+$/.test(raw)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      return Math.floor(n);
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Date.parse(normalizeUtcIso(raw));
  return Number.isFinite(parsed) ? parsed : null;
}
