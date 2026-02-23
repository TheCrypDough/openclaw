/*
 * AUTO ANNOTATION
 * File: src/config/test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(fn, { prefix: "openclaw-config-" });
}

/**
 * Helper to test env var overrides. Saves/restores env vars for a callback.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withEnvOverride<T>(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const saved: Record<string, string | undefined> = {};
  for (const key of Object.keys(overrides)) {
    saved[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(saved)) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
  }
}
