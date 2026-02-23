/*
 * AUTO ANNOTATION
 * File: extensions/zalo/src/status-issues.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ZaloAccountStatus = {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
  dmPolicy?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readZaloAccountStatus(value: ChannelAccountSnapshot): ZaloAccountStatus | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    accountId: value.accountId,
    enabled: value.enabled,
    configured: value.configured,
    dmPolicy: value.dmPolicy,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectZaloStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: ChannelStatusIssue[] = [];
  for (const entry of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = readZaloAccountStatus(entry);
    if (!account) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountId = asString(account.accountId) ?? "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enabled = account.enabled !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configured = account.configured === true;
    if (!enabled || !configured) {
      continue;
    }

    if (account.dmPolicy === "open") {
      issues.push({
        channel: "zalo",
        accountId,
        kind: "config",
        message: 'Zalo dmPolicy is "open", allowing any user to message the bot without pairing.',
        fix: 'Set channels.zalo.dmPolicy to "pairing" or "allowlist" to restrict access.',
      });
    }
  }
  return issues;
}
