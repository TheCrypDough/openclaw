/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/status-issues/bluebubbles.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../types.js";
import { asString, isRecord } from "./shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BlueBubblesAccountStatus = {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
  running?: unknown;
  baseUrl?: unknown;
  lastError?: unknown;
  probe?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BlueBubblesProbeResult = {
  ok?: boolean;
  status?: number | null;
  error?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readBlueBubblesAccountStatus(
  value: ChannelAccountSnapshot,
): BlueBubblesAccountStatus | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    accountId: value.accountId,
    enabled: value.enabled,
    configured: value.configured,
    running: value.running,
    baseUrl: value.baseUrl,
    lastError: value.lastError,
    probe: value.probe,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readBlueBubblesProbeResult(value: unknown): BlueBubblesProbeResult | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    ok: typeof value.ok === "boolean" ? value.ok : undefined,
    status: typeof value.status === "number" ? value.status : null,
    error: asString(value.error) ?? null,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectBlueBubblesStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: ChannelStatusIssue[] = [];
  for (const entry of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = readBlueBubblesAccountStatus(entry);
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
    const configured = account.configured === true;
    const running = account.running === true;
    const lastError = asString(account.lastError);
    const probe = readBlueBubblesProbeResult(account.probe);

    // Check for unconfigured accounts
    if (!configured) {
      issues.push({
        channel: "bluebubbles",
        accountId,
        kind: "config",
        message: "Not configured (missing serverUrl or password).",
        fix: "Run: openclaw channels add bluebubbles --http-url <server-url> --password <password>",
      });
      continue;
    }

    // Check for probe failures
    if (probe && probe.ok === false) {
      const errorDetail = probe.error
        ? `: ${probe.error}`
        : probe.status
          ? ` (HTTP ${probe.status})`
          : "";
      issues.push({
        channel: "bluebubbles",
        accountId,
        kind: "runtime",
        message: `BlueBubbles server unreachable${errorDetail}`,
        fix: "Check that the BlueBubbles server is running and accessible. Verify serverUrl and password in your config.",
      });
    }

    // Check for runtime errors
    if (running && lastError) {
      issues.push({
        channel: "bluebubbles",
        accountId,
        kind: "runtime",
        message: `Channel error: ${lastError}`,
        fix: "Check gateway logs for details. If the webhook is failing, verify the webhook URL is configured in BlueBubbles server settings.",
      });
    }
  }
  return issues;
}
