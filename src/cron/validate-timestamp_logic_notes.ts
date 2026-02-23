/*
 * AUTO ANNOTATION
 * File: src/cron/validate-timestamp.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseAbsoluteTimeMs } from "./parse.js";
import type { CronSchedule } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ONE_MINUTE_MS = 60 * 1000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TEN_YEARS_MS = 10 * 365.25 * 24 * 60 * 60 * 1000;

export type TimestampValidationError = {
  ok: false;
  message: string;
};

export type TimestampValidationSuccess = {
  ok: true;
};

export type TimestampValidationResult = TimestampValidationSuccess | TimestampValidationError;

/**
 * Validates at timestamps in cron schedules.
 * Rejects timestamps that are:
 * - More than 1 minute in the past
 * - More than 10 years in the future
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateScheduleTimestamp(
  schedule: CronSchedule,
  nowMs: number = Date.now(),
): TimestampValidationResult {
  if (schedule.kind !== "at") {
    return { ok: true };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const atRaw = typeof schedule.at === "string" ? schedule.at.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const atMs = atRaw ? parseAbsoluteTimeMs(atRaw) : null;

  if (atMs === null || !Number.isFinite(atMs)) {
    return {
      ok: false,
      message: `Invalid schedule.at: expected ISO-8601 timestamp (got ${String(schedule.at)})`,
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const diffMs = atMs - nowMs;

  // Check if timestamp is in the past (allow 1 minute grace period)
  if (diffMs < -ONE_MINUTE_MS) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nowDate = new Date(nowMs).toISOString();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const atDate = new Date(atMs).toISOString();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const minutesAgo = Math.floor(-diffMs / ONE_MINUTE_MS);
    return {
      ok: false,
      message: `schedule.at is in the past: ${atDate} (${minutesAgo} minutes ago). Current time: ${nowDate}`,
    };
  }

  // Check if timestamp is too far in the future
  if (diffMs > TEN_YEARS_MS) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const atDate = new Date(atMs).toISOString();
    const yearsAhead = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    return {
      ok: false,
      message: `schedule.at is too far in the future: ${atDate} (${yearsAhead} years ahead). Maximum allowed: 10 years`,
    };
  }

  return { ok: true };
}
