/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/normalize.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { QueueDropPolicy, QueueMode } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeQueueMode(raw?: string): QueueMode | undefined {
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "queue" || cleaned === "queued") {
    return "steer";
  }
  if (cleaned === "interrupt" || cleaned === "interrupts" || cleaned === "abort") {
    return "interrupt";
  }
  if (cleaned === "steer" || cleaned === "steering") {
    return "steer";
  }
  if (cleaned === "followup" || cleaned === "follow-ups" || cleaned === "followups") {
    return "followup";
  }
  if (cleaned === "collect" || cleaned === "coalesce") {
    return "collect";
  }
  if (cleaned === "steer+backlog" || cleaned === "steer-backlog" || cleaned === "steer_backlog") {
    return "steer-backlog";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeQueueDropPolicy(raw?: string): QueueDropPolicy | undefined {
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "old" || cleaned === "oldest") {
    return "old";
  }
  if (cleaned === "new" || cleaned === "newest") {
    return "new";
  }
  if (cleaned === "summarize" || cleaned === "summary") {
    return "summarize";
  }
  return undefined;
}
