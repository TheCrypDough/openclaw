/*
 * AUTO ANNOTATION
 * File: extensions/zalouser/src/status-issues.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ZalouserAccountStatus = {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
  dmPolicy?: unknown;
  lastError?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readZalouserAccountStatus(value: ChannelAccountSnapshot): ZalouserAccountStatus | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    accountId: value.accountId,
    enabled: value.enabled,
    configured: value.configured,
    dmPolicy: value.dmPolicy,
    lastError: value.lastError,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isMissingZca(lastError?: string): boolean {
  if (!lastError) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = lastError.toLowerCase();
  return lower.includes("zca") && (lower.includes("not found") || lower.includes("enoent"));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectZalouserStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: ChannelStatusIssue[] = [];
  for (const entry of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = readZalouserAccountStatus(entry);
    if (!account) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountId = asString(account.accountId) ?? "default";
    const enabled = account.enabled !== false;
    if (!enabled) {
      continue;
    }

    const configured = account.configured === true;
    const lastError = asString(account.lastError)?.trim();

    if (!configured) {
      if (isMissingZca(lastError)) {
        issues.push({
          channel: "zalouser",
          accountId,
          kind: "runtime",
          message: "zca CLI not found in PATH.",
          fix: "Install zca-cli and ensure it is on PATH for the Gateway process.",
        });
      } else {
        issues.push({
          channel: "zalouser",
          accountId,
          kind: "auth",
          message: "Not authenticated (no zca session).",
          fix: "Run: openclaw channels login --channel zalouser",
        });
      }
      continue;
    }

    if (account.dmPolicy === "open") {
      issues.push({
        channel: "zalouser",
        accountId,
        kind: "config",
        message:
          'Zalo Personal dmPolicy is "open", allowing any user to message the bot without pairing.',
        fix: 'Set channels.zalouser.dmPolicy to "pairing" or "allowlist" to restrict access.',
      });
    }
  }
  return issues;
}
