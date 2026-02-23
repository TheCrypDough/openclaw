/*
 * AUTO ANNOTATION
 * File: src/shared/string-normalization.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeStringEntries(list?: Array<string | number>) {
  return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeStringEntriesLower(list?: Array<string | number>) {
  return normalizeStringEntries(list).map((entry) => entry.toLowerCase());
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeHyphenSlug(raw?: string | null) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim().toLowerCase() ?? "";
  if (!trimmed) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dashed = trimmed.replace(/\s+/g, "-");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = dashed.replace(/[^a-z0-9#@._+-]+/g, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAtHashSlug(raw?: string | null) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim().toLowerCase() ?? "";
  if (!trimmed) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutPrefix = trimmed.replace(/^[@#]+/, "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dashed = withoutPrefix.replace(/[\s_]+/g, "-");
  const cleaned = dashed.replace(/[^a-z0-9-]+/g, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
