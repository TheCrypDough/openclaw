/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/status-issues/whatsapp.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatCliCommand } from "../../../cli/command-format.js";
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../types.js";
import { asString, isRecord } from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type WhatsAppAccountStatus = {
  accountId?: unknown;
  enabled?: unknown;
  linked?: unknown;
  connected?: unknown;
  running?: unknown;
  reconnectAttempts?: unknown;
  lastError?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readWhatsAppAccountStatus(value: ChannelAccountSnapshot): WhatsAppAccountStatus | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    accountId: value.accountId,
    enabled: value.enabled,
    linked: value.linked,
    connected: value.connected,
    running: value.running,
    reconnectAttempts: value.reconnectAttempts,
    lastError: value.lastError,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectWhatsAppStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: ChannelStatusIssue[] = [];
  for (const entry of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = readWhatsAppAccountStatus(entry);
    if (!account) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountId = asString(account.accountId) ?? "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enabled = account.enabled !== false;
    if (!enabled) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const linked = account.linked === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const running = account.running === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const connected = account.connected === true;
    const reconnectAttempts =
      typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
    const lastError = asString(account.lastError);

    if (!linked) {
      issues.push({
        channel: "whatsapp",
        accountId,
        kind: "auth",
        message: "Not linked (no WhatsApp Web session).",
        fix: `Run: ${formatCliCommand("openclaw channels login")} (scan QR on the gateway host).`,
      });
      continue;
    }

    if (running && !connected) {
      issues.push({
        channel: "whatsapp",
        accountId,
        kind: "runtime",
        message: `Linked but disconnected${reconnectAttempts != null ? ` (reconnectAttempts=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
        fix: `Run: ${formatCliCommand("openclaw doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`,
      });
    }
  }
  return issues;
}
