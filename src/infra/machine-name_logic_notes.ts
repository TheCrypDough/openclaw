/*
 * AUTO ANNOTATION
 * File: src/infra/machine-name.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execFile } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const execFileAsync = promisify(execFile);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let cachedPromise: Promise<string> | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function tryScutil(key: "ComputerName" | "LocalHostName") {
  try {
    const { stdout } = await execFileAsync("/usr/sbin/scutil", ["--get", key], {
      timeout: 1000,
      windowsHide: true,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = String(stdout ?? "").trim();
    return value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function fallbackHostName() {
  return (
    os
      .hostname()
      .replace(/\.local$/i, "")
      .trim() || "openclaw"
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getMachineDisplayName(): Promise<string> {
  if (cachedPromise) {
    return cachedPromise;
  }
  cachedPromise = (async () => {
    if (process.env.VITEST || process.env.NODE_ENV === "test") {
      return fallbackHostName();
    }
    if (process.platform === "darwin") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const computerName = await tryScutil("ComputerName");
      if (computerName) {
        return computerName;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const localHostName = await tryScutil("LocalHostName");
      if (localHostName) {
        return localHostName;
      }
    }
    return fallbackHostName();
  })();
  return cachedPromise;
}
