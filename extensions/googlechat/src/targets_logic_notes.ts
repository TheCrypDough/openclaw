/*
 * AUTO ANNOTATION
 * File: extensions/googlechat/src/targets.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ResolvedGoogleChatAccount } from "./accounts.js";
import { findGoogleChatDirectMessage } from "./api.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeGoogleChatTarget(raw?: string | null): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutPrefix = trimmed.replace(/^(googlechat|google-chat|gchat):/i, "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = withoutPrefix
    .replace(/^user:(users\/)?/i, "users/")
    .replace(/^space:(spaces\/)?/i, "spaces/");
  if (isGoogleChatUserTarget(normalized)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const suffix = normalized.slice("users/".length);
    return suffix.includes("@") ? `users/${suffix.toLowerCase()}` : normalized;
  }
  if (isGoogleChatSpaceTarget(normalized)) {
    return normalized;
  }
  if (normalized.includes("@")) {
    return `users/${normalized.toLowerCase()}`;
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isGoogleChatUserTarget(value: string): boolean {
  return value.toLowerCase().startsWith("users/");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isGoogleChatSpaceTarget(value: string): boolean {
  return value.toLowerCase().startsWith("spaces/");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function stripMessageSuffix(target: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const index = target.indexOf("/messages/");
  if (index === -1) {
    return target;
  }
  return target.slice(0, index);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveGoogleChatOutboundSpace(params: {
  account: ResolvedGoogleChatAccount;
  target: string;
}): Promise<string> {
  const normalized = normalizeGoogleChatTarget(params.target);
  if (!normalized) {
    throw new Error("Missing Google Chat target.");
  }
  const base = stripMessageSuffix(normalized);
  if (isGoogleChatSpaceTarget(base)) {
    return base;
  }
  if (isGoogleChatUserTarget(base)) {
    const dm = await findGoogleChatDirectMessage({
      account: params.account,
      userName: base,
    });
    if (!dm?.name) {
      throw new Error(`No Google Chat DM found for ${base}`);
    }
    return dm.name;
  }
  return base;
}
