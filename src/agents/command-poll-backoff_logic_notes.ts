/*
 * AUTO ANNOTATION
 * File: src/agents/command-poll-backoff.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SessionState } from "../logging/diagnostic-session-state.js";

// Exponential backoff schedule for command polling
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BACKOFF_SCHEDULE_MS = [5000, 10000, 30000, 60000];

/**
 * Calculate suggested retry delay based on consecutive no-output poll count.
 * Implements exponential backoff schedule: 5s → 10s → 30s → 60s (capped).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function calculateBackoffMs(consecutiveNoOutputPolls: number): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const index = Math.min(consecutiveNoOutputPolls, BACKOFF_SCHEDULE_MS.length - 1);
  return BACKOFF_SCHEDULE_MS[index] ?? 60000;
}

/**
 * Record a command poll and return suggested retry delay.
 * @param state Session state to track polling in
 * @param commandId Unique identifier for the command being polled
 * @param hasNewOutput Whether this poll returned new output
 * @returns Suggested delay in milliseconds before next poll
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function recordCommandPoll(
  state: SessionState,
  commandId: string,
  hasNewOutput: boolean,
): number {
  if (!state.commandPollCounts) {
    state.commandPollCounts = new Map();
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = state.commandPollCounts.get(commandId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();

  if (hasNewOutput) {
    state.commandPollCounts.set(commandId, { count: 0, lastPollAt: now });
    return BACKOFF_SCHEDULE_MS[0] ?? 5000;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const newCount = (existing?.count ?? -1) + 1;
  state.commandPollCounts.set(commandId, { count: newCount, lastPollAt: now });

  return calculateBackoffMs(newCount);
}

/**
 * Get current suggested backoff for a command without modifying state.
 * Useful for checking current backoff level.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getCommandPollSuggestion(
  state: SessionState,
  commandId: string,
): number | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pollData = state.commandPollCounts?.get(commandId);
  if (!pollData) {
    return undefined;
  }
  return calculateBackoffMs(pollData.count);
}

/**
 * Reset poll count for a command (e.g., when command completes).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetCommandPollCount(state: SessionState, commandId: string): void {
  state.commandPollCounts?.delete(commandId);
}

/**
 * Prune stale command poll records (older than 1 hour).
 * Call periodically to prevent memory bloat.
 */
export function pruneStaleCommandPolls(state: SessionState, maxAgeMs = 3600000): void {
  if (!state.commandPollCounts) {
    return;
  }

  const now = Date.now();
  for (const [commandId, data] of state.commandPollCounts.entries()) {
    if (now - data.lastPollAt > maxAgeMs) {
      state.commandPollCounts.delete(commandId);
    }
  }
}
