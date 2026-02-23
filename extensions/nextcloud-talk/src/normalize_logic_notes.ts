/*
 * AUTO ANNOTATION
 * File: extensions/nextcloud-talk/src/normalize.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeNextcloudTalkMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let normalized = trimmed;

  if (normalized.startsWith("nextcloud-talk:")) {
    normalized = normalized.slice("nextcloud-talk:".length).trim();
  } else if (normalized.startsWith("nc-talk:")) {
    normalized = normalized.slice("nc-talk:".length).trim();
  } else if (normalized.startsWith("nc:")) {
    normalized = normalized.slice("nc:".length).trim();
  }

  if (normalized.startsWith("room:")) {
    normalized = normalized.slice("room:".length).trim();
  }

  if (!normalized) {
    return undefined;
  }

  return `nextcloud-talk:${normalized}`.toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeNextcloudTalkTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }

  if (/^(nextcloud-talk|nc-talk|nc):/i.test(trimmed)) {
    return true;
  }

  return /^[a-z0-9]{8,}$/i.test(trimmed);
}
