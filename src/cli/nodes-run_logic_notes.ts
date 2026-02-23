/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-run.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseTimeoutMs } from "./parse-timeout.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseEnvPairs(pairs: unknown): Record<string, string> | undefined {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env: Record<string, string> = {};
  for (const pair of pairs) {
    if (typeof pair !== "string") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const idx = pair.indexOf("=");
    if (idx <= 0) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = pair.slice(0, idx).trim();
    if (!key) {
      continue;
    }
    env[key] = pair.slice(idx + 1);
  }
  return Object.keys(env).length > 0 ? env : undefined;
}

export { parseTimeoutMs };
