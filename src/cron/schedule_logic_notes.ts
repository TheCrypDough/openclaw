/*
 * AUTO ANNOTATION
 * File: src/cron/schedule.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Cron } from "croner";
import { parseAbsoluteTimeMs } from "./parse.js";
import type { CronSchedule } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveCronTimezone(tz?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = typeof tz === "string" ? tz.trim() : "";
  if (trimmed) {
    return trimmed;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeNextRunAtMs(schedule: CronSchedule, nowMs: number): number | undefined {
  if (schedule.kind === "at") {
    // Handle both canonical `at` (string) and legacy `atMs` (number) fields.
    // The store migration should convert atMs→at, but be defensive in case
    // the migration hasn't run yet or was bypassed.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sched = schedule as { at?: string; atMs?: number | string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const atMs =
      typeof sched.atMs === "number" && Number.isFinite(sched.atMs) && sched.atMs > 0
        ? sched.atMs
        : typeof sched.atMs === "string"
          ? parseAbsoluteTimeMs(sched.atMs)
          : typeof sched.at === "string"
            ? parseAbsoluteTimeMs(sched.at)
            : null;
    if (atMs === null) {
      return undefined;
    }
    return atMs > nowMs ? atMs : undefined;
  }

  if (schedule.kind === "every") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const everyMs = Math.max(1, Math.floor(schedule.everyMs));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const anchor = Math.max(0, Math.floor(schedule.anchorMs ?? nowMs));
    if (nowMs < anchor) {
      return anchor;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const elapsed = nowMs - anchor;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const steps = Math.max(1, Math.floor((elapsed + everyMs - 1) / everyMs));
    return anchor + steps * everyMs;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exprSource = (schedule as { expr?: unknown }).expr;
  if (typeof exprSource !== "string") {
    throw new Error("invalid cron schedule: expr is required");
  }
  const expr = exprSource.trim();
  if (!expr) {
    return undefined;
  }
  const cron = new Cron(expr, {
    timezone: resolveCronTimezone(schedule.tz),
    catch: false,
  });
  const next = cron.nextRun(new Date(nowMs));
  if (!next) {
    return undefined;
  }
  const nextMs = next.getTime();
  if (!Number.isFinite(nextMs)) {
    return undefined;
  }
  if (nextMs > nowMs) {
    return nextMs;
  }

  // Guard against same-second rescheduling loops: if croner returns
  // "now" (or an earlier instant), retry from the next whole second.
  const nextSecondMs = Math.floor(nowMs / 1000) * 1000 + 1000;
  const retry = cron.nextRun(new Date(nextSecondMs));
  if (!retry) {
    return undefined;
  }
  const retryMs = retry.getTime();
  return Number.isFinite(retryMs) && retryMs > nowMs ? retryMs : undefined;
}
