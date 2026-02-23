/*
 * AUTO ANNOTATION
 * File: src/logging/levels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ALLOWED_LOG_LEVELS = [
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

export type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeLogLevel(level?: string, fallback: LogLevel = "info") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = (level ?? fallback).trim();
  return ALLOWED_LOG_LEVELS.includes(candidate as LogLevel) ? (candidate as LogLevel) : fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function levelToMinLevel(level: LogLevel): number {
  // tslog level ordering: fatal=0, error=1, warn=2, info=3, debug=4, trace=5
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const map: Record<LogLevel, number> = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
    silent: Number.POSITIVE_INFINITY,
  };
  return map[level];
}
