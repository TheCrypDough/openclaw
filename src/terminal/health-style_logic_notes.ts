/*
 * AUTO ANNOTATION
 * File: src/terminal/health-style.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { theme } from "./theme.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function styleHealthChannelLine(line: string, rich: boolean): string {
  if (!rich) {
    return line;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const colon = line.indexOf(":");
  if (colon === -1) {
    return line;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = line.slice(0, colon + 1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const detail = line.slice(colon + 1).trimStart();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = detail.toLowerCase();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const applyPrefix = (prefix: string, color: (value: string) => string) =>
    `${label} ${color(detail.slice(0, prefix.length))}${detail.slice(prefix.length)}`;

  if (normalized.startsWith("failed")) {
    return applyPrefix("failed", theme.error);
  }
  if (normalized.startsWith("ok")) {
    return applyPrefix("ok", theme.success);
  }
  if (normalized.startsWith("linked")) {
    return applyPrefix("linked", theme.success);
  }
  if (normalized.startsWith("configured")) {
    return applyPrefix("configured", theme.success);
  }
  if (normalized.startsWith("not linked")) {
    return applyPrefix("not linked", theme.warn);
  }
  if (normalized.startsWith("not configured")) {
    return applyPrefix("not configured", theme.muted);
  }
  if (normalized.startsWith("unknown")) {
    return applyPrefix("unknown", theme.warn);
  }

  return line;
}
