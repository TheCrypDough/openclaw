/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/status-issues/shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isRecord } from "../../../utils.js";
export { isRecord };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatMatchMetadata(params: {
  matchKey?: unknown;
  matchSource?: unknown;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey =
    typeof params.matchKey === "string"
      ? params.matchKey
      : typeof params.matchKey === "number"
        ? String(params.matchKey)
        : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchSource = asString(params.matchSource);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = [
    matchKey ? `matchKey=${matchKey}` : null,
    matchSource ? `matchSource=${matchSource}` : null,
  ].filter((entry): entry is string => Boolean(entry));
  return parts.length > 0 ? parts.join(" ") : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function appendMatchMetadata(
  message: string,
  params: { matchKey?: unknown; matchSource?: unknown },
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const meta = formatMatchMetadata(params);
  return meta ? `${message} (${meta})` : message;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEnabledConfiguredAccountId(account: {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
}): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = asString(account.accountId) ?? "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enabled = account.enabled !== false;
  const configured = account.configured === true;
  return enabled && configured ? accountId : null;
}
