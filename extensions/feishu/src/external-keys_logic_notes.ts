/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/external-keys.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f]/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_EXTERNAL_KEY_LENGTH = 512;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeFeishuExternalKey(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_EXTERNAL_KEY_LENGTH) {
    return undefined;
  }
  if (CONTROL_CHARS_RE.test(normalized)) {
    return undefined;
  }
  if (normalized.includes("/") || normalized.includes("\\") || normalized.includes("..")) {
    return undefined;
  }
  return normalized;
}
