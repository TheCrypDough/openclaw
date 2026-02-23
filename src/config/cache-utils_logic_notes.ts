/*
 * AUTO ANNOTATION
 * File: src/config/cache-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCacheTtlMs(params: {
  envValue: string | undefined;
  defaultTtlMs: number;
}): number {
  const { envValue, defaultTtlMs } = params;
  if (envValue) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = Number.parseInt(envValue, 10);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return defaultTtlMs;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isCacheEnabled(ttlMs: number): boolean {
  return ttlMs > 0;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getFileMtimeMs(filePath: string): number | undefined {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return undefined;
  }
}
