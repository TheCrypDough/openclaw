/*
 * AUTO ANNOTATION
 * File: src/infra/wsl.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let wslCached: boolean | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isWSLEnv(): boolean {
  if (process.env.WSL_INTEROP || process.env.WSL_DISTRO_NAME || process.env.WSLENV) {
    return true;
  }
  return false;
}

/**
 * Synchronously check if running in WSL.
 * Checks env vars first, then /proc/version.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isWSLSync(): boolean {
  if (process.platform !== "linux") {
    return false;
  }
  if (isWSLEnv()) {
    return true;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const release = readFileSync("/proc/version", "utf8").toLowerCase();
    return release.includes("microsoft") || release.includes("wsl");
  } catch {
    return false;
  }
}

/**
 * Synchronously check if running in WSL2.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isWSL2Sync(): boolean {
  if (!isWSLSync()) {
    return false;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const version = readFileSync("/proc/version", "utf8").toLowerCase();
    return version.includes("wsl2") || version.includes("microsoft-standard");
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function isWSL(): Promise<boolean> {
  if (wslCached !== null) {
    return wslCached;
  }
  if (isWSLEnv()) {
    wslCached = true;
    return wslCached;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const release = await fs.readFile("/proc/sys/kernel/osrelease", "utf8");
    wslCached =
      release.toLowerCase().includes("microsoft") || release.toLowerCase().includes("wsl");
  } catch {
    wslCached = false;
  }
  return wslCached;
}
