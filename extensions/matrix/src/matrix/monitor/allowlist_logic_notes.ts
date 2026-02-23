/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/allowlist.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AllowlistMatch } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAllowList(list?: Array<string | number>) {
  return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeMatrixUser(raw?: string | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = (raw ?? "").trim();
  if (!value) {
    return "";
  }
  if (!value.startsWith("@") || !value.includes(":")) {
    return value.toLowerCase();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutAt = value.slice(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const splitIndex = withoutAt.indexOf(":");
  if (splitIndex === -1) {
    return value.toLowerCase();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const localpart = withoutAt.slice(0, splitIndex).toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const server = withoutAt.slice(splitIndex + 1).toLowerCase();
  if (!server) {
    return value.toLowerCase();
  }
  return `@${localpart}:${server.toLowerCase()}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeMatrixUserId(raw?: string | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = trimmed.toLowerCase();
  if (lowered.startsWith("matrix:")) {
    return normalizeMatrixUser(trimmed.slice("matrix:".length));
  }
  if (lowered.startsWith("user:")) {
    return normalizeMatrixUser(trimmed.slice("user:".length));
  }
  return normalizeMatrixUser(trimmed);
}

function normalizeMatrixAllowListEntry(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed === "*") {
    return trimmed;
  }
  const lowered = trimmed.toLowerCase();
  if (lowered.startsWith("matrix:")) {
    return `matrix:${normalizeMatrixUser(trimmed.slice("matrix:".length))}`;
  }
  if (lowered.startsWith("user:")) {
    return `user:${normalizeMatrixUser(trimmed.slice("user:".length))}`;
  }
  return normalizeMatrixUser(trimmed);
}

export function normalizeMatrixAllowList(list?: Array<string | number>) {
  return normalizeAllowList(list).map((entry) => normalizeMatrixAllowListEntry(entry));
}

export type MatrixAllowListMatch = AllowlistMatch<
  "wildcard" | "id" | "prefixed-id" | "prefixed-user"
>;

export function resolveMatrixAllowListMatch(params: {
  allowList: string[];
  userId?: string;
}): MatrixAllowListMatch {
  const allowList = params.allowList;
  if (allowList.length === 0) {
    return { allowed: false };
  }
  if (allowList.includes("*")) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
  const userId = normalizeMatrixUser(params.userId);
  const candidates: Array<{ value?: string; source: MatrixAllowListMatch["matchSource"] }> = [
    { value: userId, source: "id" },
    { value: userId ? `matrix:${userId}` : "", source: "prefixed-id" },
    { value: userId ? `user:${userId}` : "", source: "prefixed-user" },
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

export function resolveMatrixAllowListMatches(params: { allowList: string[]; userId?: string }) {
  return resolveMatrixAllowListMatch(params).allowed;
}
