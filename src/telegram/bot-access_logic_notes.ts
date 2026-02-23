/*
 * AUTO ANNOTATION
 * File: src/telegram/bot-access.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { firstDefined, isSenderIdAllowed, mergeAllowFromSources } from "../channels/allow-from.js";
import type { AllowlistMatch } from "../channels/allowlist-match.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

export type NormalizedAllowFrom = {
  entries: string[];
  hasWildcard: boolean;
  hasEntries: boolean;
  invalidEntries: string[];
};

export type AllowFromMatch = AllowlistMatch<"wildcard" | "id">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const warnedInvalidEntries = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("telegram/bot-access");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function warnInvalidAllowFromEntries(entries: string[]) {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  for (const entry of entries) {
    if (warnedInvalidEntries.has(entry)) {
      continue;
    }
    warnedInvalidEntries.add(entry);
    log.warn(
      [
        "Invalid allowFrom entry:",
        JSON.stringify(entry),
        "- allowFrom/groupAllowFrom authorization requires numeric Telegram sender IDs only.",
        'If you had "@username" entries, re-run onboarding (it resolves @username to IDs) or replace them manually.',
      ].join(" "),
    );
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const normalizeAllowFrom = (list?: Array<string | number>): NormalizedAllowFrom => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = (list ?? []).map((value) => String(value).trim()).filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasWildcard = entries.includes("*");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = entries
    .filter((value) => value !== "*")
    .map((value) => value.replace(/^(telegram|tg):/i, ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const invalidEntries = normalized.filter((value) => !/^\d+$/.test(value));
  if (invalidEntries.length > 0) {
    warnInvalidAllowFromEntries([...new Set(invalidEntries)]);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ids = normalized.filter((value) => /^\d+$/.test(value));
  return {
    entries: ids,
    hasWildcard,
    hasEntries: entries.length > 0,
    invalidEntries,
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const normalizeAllowFromWithStore = (params: {
  allowFrom?: Array<string | number>;
  storeAllowFrom?: string[];
  dmPolicy?: string;
}): NormalizedAllowFrom => normalizeAllowFrom(mergeAllowFromSources(params));

export const isSenderAllowed = (params: {
  allow: NormalizedAllowFrom;
  senderId?: string;
  senderUsername?: string;
}) => {
  const { allow, senderId } = params;
  return isSenderIdAllowed(allow, senderId, true);
};

export { firstDefined };

export const resolveSenderAllowMatch = (params: {
  allow: NormalizedAllowFrom;
  senderId?: string;
  senderUsername?: string;
}): AllowFromMatch => {
  const { allow, senderId } = params;
  if (allow.hasWildcard) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
  if (!allow.hasEntries) {
    return { allowed: false };
  }
  if (senderId && allow.entries.includes(senderId)) {
    return { allowed: true, matchKey: senderId, matchSource: "id" };
  }
  return { allowed: false };
};
