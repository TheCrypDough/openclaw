/*
 * AUTO ANNOTATION
 * File: src/daemon/paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveGatewayProfileSuffix } from "./constants.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const windowsAbsolutePath = /^[a-zA-Z]:[\\/]/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const windowsUncPath = /^\\\\/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveHomeDir(env: Record<string, string | undefined>): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const home = env.HOME?.trim() || env.USERPROFILE?.trim();
  if (!home) {
    throw new Error("Missing HOME");
  }
  return home;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveUserPathWithHome(input: string, home?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    if (!home) {
      throw new Error("Missing HOME");
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const expanded = trimmed.replace(/^~(?=$|[\\/])/, home);
    return path.resolve(expanded);
  }
  if (windowsAbsolutePath.test(trimmed) || windowsUncPath.test(trimmed)) {
    return trimmed;
  }
  return path.resolve(trimmed);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGatewayStateDir(env: Record<string, string | undefined>): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const home = override.startsWith("~") ? resolveHomeDir(env) : undefined;
    return resolveUserPathWithHome(override, home);
  }
  const home = resolveHomeDir(env);
  const suffix = resolveGatewayProfileSuffix(env.OPENCLAW_PROFILE);
  return path.join(home, `.openclaw${suffix}`);
}
