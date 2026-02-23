/*
 * AUTO ANNOTATION
 * File: src/line/bot-access.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { firstDefined, isSenderIdAllowed, mergeAllowFromSources } from "../channels/allow-from.js";

export type NormalizedAllowFrom = {
  entries: string[];
  hasWildcard: boolean;
  hasEntries: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAllowEntry(value: string | number): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = String(value).trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed === "*") {
    return "*";
  }
  return trimmed.replace(/^line:(?:user:)?/i, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const normalizeAllowFrom = (list?: Array<string | number>): NormalizedAllowFrom => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = (list ?? []).map((value) => normalizeAllowEntry(value)).filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasWildcard = entries.includes("*");
  return {
    entries,
    hasWildcard,
    hasEntries: entries.length > 0,
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const normalizeAllowFromWithStore = (params: {
  allowFrom?: Array<string | number>;
  storeAllowFrom?: string[];
  dmPolicy?: string;
}): NormalizedAllowFrom => normalizeAllowFrom(mergeAllowFromSources(params));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const isSenderAllowed = (params: {
  allow: NormalizedAllowFrom;
  senderId?: string;
}): boolean => {
  const { allow, senderId } = params;
  return isSenderIdAllowed(allow, senderId, false);
};

export { firstDefined };
