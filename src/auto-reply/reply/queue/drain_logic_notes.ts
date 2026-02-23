/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/drain.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { defaultRuntime } from "../../../runtime.js";
import {
  buildCollectPrompt,
  clearQueueSummaryState,
  drainCollectItemIfNeeded,
  drainNextQueueItem,
  hasCrossChannelItems,
  previewQueueSummaryPrompt,
  waitForQueueDebounce,
} from "../../../utils/queue-helpers.js";
import { isRoutableChannel } from "../route-reply.js";
import { FOLLOWUP_QUEUES } from "./state.js";
import type { FollowupRun } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function scheduleFollowupDrain(
  key: string,
  runFollowup: (run: FollowupRun) => Promise<void>,
): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queue = FOLLOWUP_QUEUES.get(key);
  if (!queue || queue.draining) {
    return;
  }
  queue.draining = true;
  void (async () => {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let forceIndividualCollect = false;
      while (queue.items.length > 0 || queue.droppedCount > 0) {
        await waitForQueueDebounce(queue);
        if (queue.mode === "collect") {
          // Once the batch is mixed, never collect again within this drain.
          // Prevents “collect after shift” collapsing different targets.
          //
          // Debug: `pnpm test src/auto-reply/reply/queue.collect-routing.test.ts`
          // Check if messages span multiple channels.
          // If so, process individually to preserve per-message routing.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const isCrossChannel = hasCrossChannelItems(queue.items, (item) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const channel = item.originatingChannel;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const to = item.originatingTo;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const accountId = item.originatingAccountId;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const threadId = item.originatingThreadId;
            if (!channel && !to && !accountId && threadId == null) {
              return {};
            }
            if (!isRoutableChannel(channel) || !to) {
              return { cross: true };
            }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
            const threadKey = threadId != null ? String(threadId) : "";
            return {
              key: [channel, to, accountId || "", threadKey].join("|"),
            };
          });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const collectDrainResult = await drainCollectItemIfNeeded({
            forceIndividualCollect,
            isCrossChannel,
            setForceIndividualCollect: (next) => {
              forceIndividualCollect = next;
            },
            items: queue.items,
            run: runFollowup,
          });
          if (collectDrainResult === "empty") {
            break;
          }
          if (collectDrainResult === "drained") {
            continue;
          }

          const items = queue.items.slice();
          const summary = previewQueueSummaryPrompt({ state: queue, noun: "message" });
          const run = items.at(-1)?.run ?? queue.lastRun;
          if (!run) {
            break;
          }

          // Preserve originating channel from items when collecting same-channel.
          const originatingChannel = items.find((i) => i.originatingChannel)?.originatingChannel;
          const originatingTo = items.find((i) => i.originatingTo)?.originatingTo;
          const originatingAccountId = items.find(
            (i) => i.originatingAccountId,
          )?.originatingAccountId;
          const originatingThreadId = items.find(
            (i) => i.originatingThreadId != null,
          )?.originatingThreadId;

          const prompt = buildCollectPrompt({
            title: "[Queued messages while agent was busy]",
            items,
            summary,
            renderItem: (item, idx) => `---\nQueued #${idx + 1}\n${item.prompt}`.trim(),
          });
          await runFollowup({
            prompt,
            run,
            enqueuedAt: Date.now(),
            originatingChannel,
            originatingTo,
            originatingAccountId,
            originatingThreadId,
          });
          queue.items.splice(0, items.length);
          if (summary) {
            clearQueueSummaryState(queue);
          }
          continue;
        }

        const summaryPrompt = previewQueueSummaryPrompt({ state: queue, noun: "message" });
        if (summaryPrompt) {
          const run = queue.lastRun;
          if (!run) {
            break;
          }
          if (
            !(await drainNextQueueItem(queue.items, async () => {
              await runFollowup({
                prompt: summaryPrompt,
                run,
                enqueuedAt: Date.now(),
              });
            }))
          ) {
            break;
          }
          clearQueueSummaryState(queue);
          continue;
        }

        if (!(await drainNextQueueItem(queue.items, runFollowup))) {
          break;
        }
      }
    } catch (err) {
      queue.lastEnqueuedAt = Date.now();
      defaultRuntime.error?.(`followup queue drain failed for ${key}: ${String(err)}`);
    } finally {
      queue.draining = false;
      if (queue.items.length === 0 && queue.droppedCount === 0) {
        FOLLOWUP_QUEUES.delete(key);
      } else {
        scheduleFollowupDrain(key, runFollowup);
      }
    }
  })();
}
