/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/allow-list.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AllowlistMatch } from "../../channels/allowlist-match.js";
import {
  normalizeHyphenSlug,
  normalizeStringEntries,
  normalizeStringEntriesLower,
} from "../../shared/string-normalization.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSlackSlug(raw?: string) {
  return normalizeHyphenSlug(raw);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAllowList(list?: Array<string | number>) {
  return normalizeStringEntries(list);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAllowListLower(list?: Array<string | number>) {
  return normalizeStringEntriesLower(list);
}

export type SlackAllowListMatch = AllowlistMatch<
  "wildcard" | "id" | "prefixed-id" | "prefixed-user" | "name" | "prefixed-name" | "slug"
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackAllowListMatch(params: {
  allowList: string[];
  id?: string;
  name?: string;
}): SlackAllowListMatch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowList = params.allowList;
  if (allowList.length === 0) {
    return { allowed: false };
  }
  if (allowList.includes("*")) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = params.id?.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = params.name?.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slug = normalizeSlackSlug(name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates: Array<{ value?: string; source: SlackAllowListMatch["matchSource"] }> = [
    { value: id, source: "id" },
    { value: id ? `slack:${id}` : undefined, source: "prefixed-id" },
    { value: id ? `user:${id}` : undefined, source: "prefixed-user" },
    { value: name, source: "name" },
    { value: name ? `slack:${name}` : undefined, source: "prefixed-name" },
    { value: slug, source: "slug" },
  ];
  for (const candidate of candidates) {
    if (!candidate.value) {
      continue;
    }
    if (allowList.includes(candidate.value)) {
      return {
        allowed: true,
        matchKey: candidate.value,
        matchSource: candidate.source,
      };
    }
  }
  return { allowed: false };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function allowListMatches(params: { allowList: string[]; id?: string; name?: string }) {
  return resolveSlackAllowListMatch(params).allowed;
}

export function resolveSlackUserAllowed(params: {
  allowList?: Array<string | number>;
  userId?: string;
  userName?: string;
}) {
  const allowList = normalizeAllowListLower(params.allowList);
  if (allowList.length === 0) {
    return true;
  }
  return allowListMatches({
    allowList,
    id: params.userId,
    name: params.userName,
  });
}
