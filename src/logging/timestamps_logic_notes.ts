/*
 * AUTO ANNOTATION
 * File: src/logging/timestamps.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLocalIsoWithOffset(now: Date): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const year = now.getFullYear();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const month = String(now.getMonth() + 1).padStart(2, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const day = String(now.getDate()).padStart(2, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const h = String(now.getHours()).padStart(2, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const m = String(now.getMinutes()).padStart(2, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const s = String(now.getSeconds()).padStart(2, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ms = String(now.getMilliseconds()).padStart(3, "0");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tzOffset = now.getTimezoneOffset();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tzSign = tzOffset <= 0 ? "+" : "-";
  const tzHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0");
  const tzMinutes = String(Math.abs(tzOffset) % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${h}:${m}:${s}.${ms}${tzSign}${tzHours}:${tzMinutes}`;
}
