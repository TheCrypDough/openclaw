/*
 * AUTO ANNOTATION
 * File: src/config/home-env.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createTempHomeEnv } from "../test-utils/temp-home.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tempHome = await createTempHomeEnv(prefix);

  try {
    return await fn(tempHome.home);
  } finally {
    await tempHome.restore();
  }
}
