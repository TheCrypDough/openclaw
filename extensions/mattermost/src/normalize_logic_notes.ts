/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/normalize.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeMattermostMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("channel:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice("channel:".length).trim();
    return id ? `channel:${id}` : undefined;
  }
  if (lower.startsWith("group:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice("group:".length).trim();
    return id ? `channel:${id}` : undefined;
  }
  if (lower.startsWith("user:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice("user:".length).trim();
    return id ? `user:${id}` : undefined;
  }
  if (lower.startsWith("mattermost:")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice("mattermost:".length).trim();
    return id ? `user:${id}` : undefined;
  }
  if (trimmed.startsWith("@")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice(1).trim();
    return id ? `@${id}` : undefined;
  }
  if (trimmed.startsWith("#")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = trimmed.slice(1).trim();
    return id ? `channel:${id}` : undefined;
  }
  return `channel:${trimmed}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeMattermostTargetId(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^(user|channel|group|mattermost):/i.test(trimmed)) {
    return true;
  }
  if (/^[@#]/.test(trimmed)) {
    return true;
  }
  return /^[a-z0-9]{8,}$/i.test(trimmed);
}
