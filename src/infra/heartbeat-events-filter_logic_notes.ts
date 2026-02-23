/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-events-filter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { HEARTBEAT_TOKEN } from "../auto-reply/tokens.js";

// Build a dynamic prompt for cron events by embedding the actual event content.
// This ensures the model sees the reminder text directly instead of relying on
// "shown in the system messages above" which may not be visible in context.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCronEventPrompt(pendingEvents: string[]): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const eventText = pendingEvents.join("\n").trim();
  if (!eventText) {
    return (
      "A scheduled cron event was triggered, but no event content was found. " +
      "Reply HEARTBEAT_OK."
    );
  }
  return (
    "A scheduled reminder has been triggered. The reminder content is:\n\n" +
    eventText +
    "\n\nPlease relay this reminder to the user in a helpful and friendly way."
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const HEARTBEAT_OK_PREFIX = HEARTBEAT_TOKEN.toLowerCase();

// Detect heartbeat-specific noise so cron reminders don't trigger on non-reminder events.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isHeartbeatAckEvent(evt: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = evt.trim();
  if (!trimmed) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = trimmed.toLowerCase();
  if (!lower.startsWith(HEARTBEAT_OK_PREFIX)) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = lower.slice(HEARTBEAT_OK_PREFIX.length);
  if (suffix.length === 0) {
    return true;
  }
  return !/[a-z0-9_]/.test(suffix[0]);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isHeartbeatNoiseEvent(evt: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = evt.trim().toLowerCase();
  if (!lower) {
    return false;
  }
  return (
    isHeartbeatAckEvent(lower) ||
    lower.includes("heartbeat poll") ||
    lower.includes("heartbeat wake")
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isExecCompletionEvent(evt: string): boolean {
  return evt.toLowerCase().includes("exec finished");
}

// Returns true when a system event should be treated as real cron reminder content.
export function isCronSystemEvent(evt: string) {
  if (!evt.trim()) {
    return false;
  }
  return !isHeartbeatNoiseEvent(evt) && !isExecCompletionEvent(evt);
}
