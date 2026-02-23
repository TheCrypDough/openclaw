/*
 * AUTO ANNOTATION
 * File: src/agents/session-dirs.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveAgentSessionDirs(stateDir: string): Promise<string[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentsDir = path.join(stateDir, "agents");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let entries: Dirent[] = [];
  try {
    entries = await fs.readdir(agentsDir, { withFileTypes: true });
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const code = (err as { code?: string }).code;
    if (code === "ENOENT") {
      return [];
    }
    throw err;
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(agentsDir, entry.name, "sessions"))
    .toSorted((a, b) => a.localeCompare(b));
}
