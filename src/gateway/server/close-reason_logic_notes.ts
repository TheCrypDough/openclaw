/*
 * AUTO ANNOTATION
 * File: src/gateway/server/close-reason.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Buffer } from "node:buffer";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CLOSE_REASON_MAX_BYTES = 120;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function truncateCloseReason(reason: string, maxBytes = CLOSE_REASON_MAX_BYTES): string {
  if (!reason) {
    return "invalid handshake";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buf = Buffer.from(reason);
  if (buf.length <= maxBytes) {
    return reason;
  }
  return buf.subarray(0, maxBytes).toString();
}
