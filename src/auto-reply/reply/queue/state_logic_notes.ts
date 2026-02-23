/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/state.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { applyQueueRuntimeSettings } from "../../../utils/queue-helpers.js";
import type { FollowupRun, QueueDropPolicy, QueueMode, QueueSettings } from "./types.js";

export type FollowupQueueState = {
  items: FollowupRun[];
  draining: boolean;
  lastEnqueuedAt: number;
  mode: QueueMode;
  debounceMs: number;
  cap: number;
  dropPolicy: QueueDropPolicy;
  droppedCount: number;
  summaryLines: string[];
  lastRun?: FollowupRun["run"];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_QUEUE_DEBOUNCE_MS = 1000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_QUEUE_CAP = 20;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_QUEUE_DROP: QueueDropPolicy = "summarize";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const FOLLOWUP_QUEUES = new Map<string, FollowupQueueState>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getFollowupQueue(key: string, settings: QueueSettings): FollowupQueueState {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = FOLLOWUP_QUEUES.get(key);
  if (existing) {
    applyQueueRuntimeSettings({
      target: existing,
      settings,
    });
    return existing;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const created: FollowupQueueState = {
    items: [],
    draining: false,
    lastEnqueuedAt: 0,
    mode: settings.mode,
    debounceMs:
      typeof settings.debounceMs === "number"
        ? Math.max(0, settings.debounceMs)
        : DEFAULT_QUEUE_DEBOUNCE_MS,
    cap:
      typeof settings.cap === "number" && settings.cap > 0
        ? Math.floor(settings.cap)
        : DEFAULT_QUEUE_CAP,
    dropPolicy: settings.dropPolicy ?? DEFAULT_QUEUE_DROP,
    droppedCount: 0,
    summaryLines: [],
  };
  applyQueueRuntimeSettings({
    target: created,
    settings,
  });
  FOLLOWUP_QUEUES.set(key, created);
  return created;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearFollowupQueue(key: string): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = key.trim();
  if (!cleaned) {
    return 0;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queue = FOLLOWUP_QUEUES.get(cleaned);
  if (!queue) {
    return 0;
  }
  const cleared = queue.items.length + queue.droppedCount;
  queue.items.length = 0;
  queue.droppedCount = 0;
  queue.summaryLines = [];
  queue.lastRun = undefined;
  queue.lastEnqueuedAt = 0;
  FOLLOWUP_QUEUES.delete(cleaned);
  return cleared;
}
