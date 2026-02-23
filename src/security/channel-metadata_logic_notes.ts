/*
 * AUTO ANNOTATION
 * File: src/security/channel-metadata.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { wrapExternalContent } from "./external-content.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MAX_CHARS = 800;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MAX_ENTRY_CHARS = 400;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeEntry(entry: string): string {
  return entry.replace(/\s+/g, " ").trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function truncateText(value: string, maxChars: number): string {
  if (maxChars <= 0) {
    return "";
  }
  if (value.length <= maxChars) {
    return value;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.slice(0, Math.max(0, maxChars - 3)).trimEnd();
  return `${trimmed}...`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildUntrustedChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = params.entries
    .map((entry) => (typeof entry === "string" ? normalizeEntry(entry) : ""))
    .filter((entry) => Boolean(entry))
    .map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deduped = cleaned.filter((entry, index, list) => list.indexOf(entry) === index);
  if (deduped.length === 0) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const body = deduped.join("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const header = `UNTRUSTED channel metadata (${params.source})`;
  const labeled = `${params.label}:\n${body}`;
  const truncated = truncateText(`${header}\n${labeled}`, params.maxChars ?? DEFAULT_MAX_CHARS);

  return wrapExternalContent(truncated, {
    source: "channel_metadata",
    includeWarning: false,
  });
}
