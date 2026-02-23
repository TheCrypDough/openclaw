/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/cleanup.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveEmbeddedSessionLane } from "../../../agents/pi-embedded.js";
import { clearCommandLane } from "../../../process/command-queue.js";
import { clearFollowupQueue } from "./state.js";

export type ClearSessionQueueResult = {
  followupCleared: number;
  laneCleared: number;
  keys: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearSessionQueues(keys: Array<string | undefined>): ClearSessionQueueResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let followupCleared = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let laneCleared = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const clearedKeys: string[] = [];

  for (const key of keys) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cleaned = key?.trim();
    if (!cleaned || seen.has(cleaned)) {
      continue;
    }
    seen.add(cleaned);
    clearedKeys.push(cleaned);
    followupCleared += clearFollowupQueue(cleaned);
    laneCleared += clearCommandLane(resolveEmbeddedSessionLane(cleaned));
  }

  return { followupCleared, laneCleared, keys: clearedKeys };
}
