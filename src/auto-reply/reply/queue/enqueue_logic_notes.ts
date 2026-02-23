/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/enqueue.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { applyQueueDropPolicy, shouldSkipQueueItem } from "../../../utils/queue-helpers.js";
import { FOLLOWUP_QUEUES, getFollowupQueue } from "./state.js";
import type { FollowupRun, QueueDedupeMode, QueueSettings } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isRunAlreadyQueued(
  run: FollowupRun,
  items: FollowupRun[],
  allowPromptFallback = false,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasSameRouting = (item: FollowupRun) =>
    item.originatingChannel === run.originatingChannel &&
    item.originatingTo === run.originatingTo &&
    item.originatingAccountId === run.originatingAccountId &&
    item.originatingThreadId === run.originatingThreadId;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageId = run.messageId?.trim();
  if (messageId) {
    return items.some((item) => item.messageId?.trim() === messageId && hasSameRouting(item));
  }
  if (!allowPromptFallback) {
    return false;
  }
  return items.some((item) => item.prompt === run.prompt && hasSameRouting(item));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function enqueueFollowupRun(
  key: string,
  run: FollowupRun,
  settings: QueueSettings,
  dedupeMode: QueueDedupeMode = "message-id",
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queue = getFollowupQueue(key, settings);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dedupe =
    dedupeMode === "none"
      ? undefined
      : (item: FollowupRun, items: FollowupRun[]) =>
          isRunAlreadyQueued(item, items, dedupeMode === "prompt");

  // Deduplicate: skip if the same message is already queued.
  if (shouldSkipQueueItem({ item: run, items: queue.items, dedupe })) {
    return false;
  }

  queue.lastEnqueuedAt = Date.now();
  queue.lastRun = run.run;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldEnqueue = applyQueueDropPolicy({
    queue,
    summarize: (item) => item.summaryLine?.trim() || item.prompt.trim(),
  });
  if (!shouldEnqueue) {
    return false;
  }

  queue.items.push(run);
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getFollowupQueueDepth(key: string): number {
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
  return queue.items.length;
}
