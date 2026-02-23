/*
 * AUTO ANNOTATION
 * File: src/agents/subagent-registry-cleanup.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  SUBAGENT_ENDED_REASON_COMPLETE,
  type SubagentLifecycleEndedReason,
} from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

export type DeferredCleanupDecision =
  | {
      kind: "defer-descendants";
      delayMs: number;
    }
  | {
      kind: "give-up";
      reason: "retry-limit" | "expiry";
      retryCount?: number;
    }
  | {
      kind: "retry";
      retryCount: number;
      resumeDelayMs?: number;
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCleanupCompletionReason(
  entry: SubagentRunRecord,
): SubagentLifecycleEndedReason {
  return entry.endedReason ?? SUBAGENT_ENDED_REASON_COMPLETE;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveEndedAgoMs(entry: SubagentRunRecord, now: number): number {
  return typeof entry.endedAt === "number" ? now - entry.endedAt : 0;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDeferredCleanupDecision(params: {
  entry: SubagentRunRecord;
  now: number;
  activeDescendantRuns: number;
  announceExpiryMs: number;
  maxAnnounceRetryCount: number;
  deferDescendantDelayMs: number;
  resolveAnnounceRetryDelayMs: (retryCount: number) => number;
}): DeferredCleanupDecision {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const endedAgo = resolveEndedAgoMs(params.entry, params.now);
  if (params.entry.expectsCompletionMessage === true && params.activeDescendantRuns > 0) {
    if (endedAgo > params.announceExpiryMs) {
      return { kind: "give-up", reason: "expiry" };
    }
    return { kind: "defer-descendants", delayMs: params.deferDescendantDelayMs };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const retryCount = (params.entry.announceRetryCount ?? 0) + 1;
  if (retryCount >= params.maxAnnounceRetryCount || endedAgo > params.announceExpiryMs) {
    return {
      kind: "give-up",
      reason: retryCount >= params.maxAnnounceRetryCount ? "retry-limit" : "expiry",
      retryCount,
    };
  }

  return {
    kind: "retry",
    retryCount,
    resumeDelayMs:
      params.entry.expectsCompletionMessage === true
        ? params.resolveAnnounceRetryDelayMs(retryCount)
        : undefined,
  };
}
