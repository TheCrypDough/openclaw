/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles/paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { saveJsonFile } from "../../infra/json-file.js";
import { resolveUserPath } from "../../utils.js";
import { resolveOpenClawAgentDir } from "../agent-paths.js";
import { AUTH_PROFILE_FILENAME, AUTH_STORE_VERSION, LEGACY_AUTH_FILENAME } from "./constants.js";
import type { AuthProfileStore } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAuthStorePath(agentDir?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveUserPath(agentDir ?? resolveOpenClawAgentDir());
  return path.join(resolved, AUTH_PROFILE_FILENAME);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveLegacyAuthStorePath(agentDir?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveUserPath(agentDir ?? resolveOpenClawAgentDir());
  return path.join(resolved, LEGACY_AUTH_FILENAME);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAuthStorePathForDisplay(agentDir?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pathname = resolveAuthStorePath(agentDir);
  return pathname.startsWith("~") ? pathname : resolveUserPath(pathname);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensureAuthStoreFile(pathname: string) {
  if (fs.existsSync(pathname)) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload: AuthProfileStore = {
    version: AUTH_STORE_VERSION,
    profiles: {},
  };
  saveJsonFile(pathname, payload);
}
