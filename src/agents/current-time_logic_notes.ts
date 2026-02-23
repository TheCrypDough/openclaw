/*
 * AUTO ANNOTATION
 * File: src/agents/current-time.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  type TimeFormatPreference,
  formatUserTime,
  resolveUserTimeFormat,
  resolveUserTimezone,
} from "./date-time.js";

export type CronStyleNow = {
  userTimezone: string;
  formattedTime: string;
  timeLine: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TimeConfigLike = {
  agents?: {
    defaults?: {
      userTimezone?: string;
      timeFormat?: TimeFormatPreference;
    };
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCronStyleNow(cfg: TimeConfigLike, nowMs: number): CronStyleNow {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userTimezone = resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userTimeFormat = resolveUserTimeFormat(cfg.agents?.defaults?.timeFormat);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formattedTime =
    formatUserTime(new Date(nowMs), userTimezone, userTimeFormat) ?? new Date(nowMs).toISOString();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeLine = `Current time: ${formattedTime} (${userTimezone})`;
  return { userTimezone, formattedTime, timeLine };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function appendCronStyleCurrentTimeLine(text: string, cfg: TimeConfigLike, nowMs: number) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = text.trimEnd();
  if (!base || base.includes("Current time:")) {
    return base;
  }
  const { timeLine } = resolveCronStyleNow(cfg, nowMs);
  return `${base}\n${timeLine}`;
}
