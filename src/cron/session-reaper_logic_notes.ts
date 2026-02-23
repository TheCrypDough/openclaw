/*
 * AUTO ANNOTATION
 * File: src/cron/session-reaper.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Cron session reaper — prunes completed isolated cron run sessions
 * from the session store after a configurable retention period.
 *
 * Pattern: sessions keyed as `...:cron:<jobId>:run:<uuid>` are ephemeral
 * run records. The base session (`...:cron:<jobId>`) is kept as-is.
 */

import { parseDurationMs } from "../cli/parse-duration.js";
import { updateSessionStore } from "../config/sessions.js";
import type { CronConfig } from "../config/types.cron.js";
import { isCronRunSessionKey } from "../sessions/session-key-utils.js";
import type { Logger } from "./service/state.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_RETENTION_MS = 24 * 3_600_000; // 24 hours

/** Minimum interval between reaper sweeps (avoid running every timer tick). */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MIN_SWEEP_INTERVAL_MS = 5 * 60_000; // 5 minutes

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const lastSweepAtMsByStore = new Map<string, number>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveRetentionMs(cronConfig?: CronConfig): number | null {
  if (cronConfig?.sessionRetention === false) {
    return null; // pruning disabled
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = cronConfig?.sessionRetention;
  if (typeof raw === "string" && raw.trim()) {
    try {
      return parseDurationMs(raw.trim(), { defaultUnit: "h" });
    } catch {
      return DEFAULT_RETENTION_MS;
    }
  }
  return DEFAULT_RETENTION_MS;
}

export type ReaperResult = {
  swept: boolean;
  pruned: number;
};

/**
 * Sweep the session store and prune expired cron run sessions.
 * Designed to be called from the cron timer tick — self-throttles via
 * MIN_SWEEP_INTERVAL_MS to avoid excessive I/O.
 *
 * Lock ordering: this function acquires the session-store file lock via
 * `updateSessionStore`. It must be called OUTSIDE of the cron service's
 * own `locked()` section to avoid lock-order inversions. The cron timer
 * calls this after all `locked()` sections have been released.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sweepCronRunSessions(params: {
  cronConfig?: CronConfig;
  /** Resolved path to sessions.json — required. */
  sessionStorePath: string;
  nowMs?: number;
  log: Logger;
  /** Override for testing — skips the min-interval throttle. */
  force?: boolean;
}): Promise<ReaperResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = params.nowMs ?? Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = params.sessionStorePath;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lastSweepAtMs = lastSweepAtMsByStore.get(storePath) ?? 0;

  // Throttle: don't sweep more often than every 5 minutes.
  if (!params.force && now - lastSweepAtMs < MIN_SWEEP_INTERVAL_MS) {
    return { swept: false, pruned: 0 };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const retentionMs = resolveRetentionMs(params.cronConfig);
  if (retentionMs === null) {
    lastSweepAtMsByStore.set(storePath, now);
    return { swept: false, pruned: 0 };
  }

  let pruned = 0;
  try {
    await updateSessionStore(storePath, (store) => {
      const cutoff = now - retentionMs;
      for (const key of Object.keys(store)) {
        if (!isCronRunSessionKey(key)) {
          continue;
        }
        const entry = store[key];
        if (!entry) {
          continue;
        }
        const updatedAt = entry.updatedAt ?? 0;
        if (updatedAt < cutoff) {
          delete store[key];
          pruned++;
        }
      }
    });
  } catch (err) {
    params.log.warn({ err: String(err) }, "cron-reaper: failed to sweep session store");
    return { swept: false, pruned: 0 };
  }

  lastSweepAtMsByStore.set(storePath, now);

  if (pruned > 0) {
    params.log.info(
      { pruned, retentionMs },
      `cron-reaper: pruned ${pruned} expired cron run session(s)`,
    );
  }

  return { swept: true, pruned };
}

/** Reset the throttle timer (for tests). */
export function resetReaperThrottle(): void {
  lastSweepAtMsByStore.clear();
}
