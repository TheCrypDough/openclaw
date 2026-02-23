/*
 * AUTO ANNOTATION
 * File: src/cron/stagger.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { CronSchedule } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_TOP_OF_HOUR_STAGGER_MS = 5 * 60 * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseCronFields(expr: string) {
  return expr.trim().split(/\s+/).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isRecurringTopOfHourCronExpr(expr: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fields = parseCronFields(expr);
  if (fields.length === 5) {
    const [minuteField, hourField] = fields;
    return minuteField === "0" && hourField.includes("*");
  }
  if (fields.length === 6) {
    const [secondField, minuteField, hourField] = fields;
    return secondField === "0" && minuteField === "0" && hourField.includes("*");
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeCronStaggerMs(raw: unknown): number | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const numeric =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw.trim()
        ? Number(raw)
        : Number.NaN;
  if (!Number.isFinite(numeric)) {
    return undefined;
  }
  return Math.max(0, Math.floor(numeric));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDefaultCronStaggerMs(expr: string): number | undefined {
  return isRecurringTopOfHourCronExpr(expr) ? DEFAULT_TOP_OF_HOUR_STAGGER_MS : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCronStaggerMs(schedule: Extract<CronSchedule, { kind: "cron" }>): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit = normalizeCronStaggerMs(schedule.staggerMs);
  if (explicit !== undefined) {
    return explicit;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expr = (schedule as { expr?: unknown }).expr;
  const cronExpr = typeof expr === "string" ? expr : "";
  return resolveDefaultCronStaggerMs(cronExpr) ?? 0;
}
