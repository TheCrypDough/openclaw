/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/normalize/signal.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSignalMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let normalized = trimmed;
  if (normalized.toLowerCase().startsWith("signal:")) {
    normalized = normalized.slice("signal:".length).trim();
  }
  if (!normalized) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = normalized.toLowerCase();
  if (lower.startsWith("group:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = normalized.slice("group:".length).trim();
    // Signal group IDs are base64-like and case-sensitive. Preserve ID casing.
    return id ? `group:${id}` : undefined;
  }
  if (lower.startsWith("username:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = normalized.slice("username:".length).trim();
    return id ? `username:${id}`.toLowerCase() : undefined;
  }
  if (lower.startsWith("u:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = normalized.slice("u:".length).trim();
    return id ? `username:${id}`.toLowerCase() : undefined;
  }
  if (lower.startsWith("uuid:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = normalized.slice("uuid:".length).trim();
    return id ? id.toLowerCase() : undefined;
  }
  return normalized.toLowerCase();
}

// UUID pattern for signal-cli recipient IDs
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const UUID_COMPACT_PATTERN = /^[0-9a-f]{32}$/i;

export function looksLikeSignalTargetId(raw: string, normalized?: string): boolean {
  const candidates = [raw, normalized ?? ""].map((value) => value.trim()).filter(Boolean);

  for (const candidate of candidates) {
    if (/^(signal:)?(group:|username:|u:)/i.test(candidate)) {
      return true;
    }
    if (/^(signal:)?uuid:/i.test(candidate)) {
      const stripped = candidate
        .replace(/^signal:/i, "")
        .replace(/^uuid:/i, "")
        .trim();
      if (!stripped) {
        continue;
      }
      if (UUID_PATTERN.test(stripped) || UUID_COMPACT_PATTERN.test(stripped)) {
        return true;
      }
      continue;
    }

    const withoutSignalPrefix = candidate.replace(/^signal:/i, "").trim();
    // Accept UUIDs (used by signal-cli for reactions)
    if (UUID_PATTERN.test(withoutSignalPrefix) || UUID_COMPACT_PATTERN.test(withoutSignalPrefix)) {
      return true;
    }
    if (/^\+?\d{3,}$/.test(withoutSignalPrefix)) {
      return true;
    }
  }

  return false;
}
