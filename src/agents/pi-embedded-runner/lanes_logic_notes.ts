/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/lanes.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { CommandLane } from "../../process/lanes.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSessionLane(key: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = key.trim() || CommandLane.Main;
  return cleaned.startsWith("session:") ? cleaned : `session:${cleaned}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGlobalLane(lane?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = lane?.trim();
  return cleaned ? cleaned : CommandLane.Main;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEmbeddedSessionLane(key: string) {
  return resolveSessionLane(key);
}
