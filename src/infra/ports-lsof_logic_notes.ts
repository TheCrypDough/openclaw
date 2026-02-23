/*
 * AUTO ANNOTATION
 * File: src/infra/ports-lsof.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import fsPromises from "node:fs/promises";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LSOF_CANDIDATES =
  process.platform === "darwin"
    ? ["/usr/sbin/lsof", "/usr/bin/lsof"]
    : ["/usr/bin/lsof", "/usr/sbin/lsof"];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function canExecute(path: string): Promise<boolean> {
  try {
    await fsPromises.access(path, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveLsofCommand(): Promise<string> {
  for (const candidate of LSOF_CANDIDATES) {
    if (await canExecute(candidate)) {
      return candidate;
    }
  }
  return "lsof";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveLsofCommandSync(): string {
  for (const candidate of LSOF_CANDIDATES) {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      // keep trying
    }
  }
  return "lsof";
}
