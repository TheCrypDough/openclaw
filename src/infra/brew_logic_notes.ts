/*
 * AUTO ANNOTATION
 * File: src/infra/brew.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isExecutable(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizePathValue(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBrewPathDirs(opts?: {
  homeDir?: string;
  env?: NodeJS.ProcessEnv;
}): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const homeDir = opts?.homeDir ?? os.homedir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = opts?.env ?? process.env;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dirs: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefix = normalizePathValue(env.HOMEBREW_PREFIX);
  if (prefix) {
    dirs.push(path.join(prefix, "bin"), path.join(prefix, "sbin"));
  }

  // Linuxbrew defaults.
  dirs.push(path.join(homeDir, ".linuxbrew", "bin"));
  dirs.push(path.join(homeDir, ".linuxbrew", "sbin"));
  dirs.push("/home/linuxbrew/.linuxbrew/bin", "/home/linuxbrew/.linuxbrew/sbin");

  // macOS defaults (also used by some Linux setups).
  dirs.push("/opt/homebrew/bin", "/usr/local/bin");

  return dirs;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBrewExecutable(opts?: {
  homeDir?: string;
  env?: NodeJS.ProcessEnv;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const homeDir = opts?.homeDir ?? os.homedir();
  const env = opts?.env ?? process.env;

  const candidates: string[] = [];

  const brewFile = normalizePathValue(env.HOMEBREW_BREW_FILE);
  if (brewFile) {
    candidates.push(brewFile);
  }

  const prefix = normalizePathValue(env.HOMEBREW_PREFIX);
  if (prefix) {
    candidates.push(path.join(prefix, "bin", "brew"));
  }

  // Linuxbrew defaults.
  candidates.push(path.join(homeDir, ".linuxbrew", "bin", "brew"));
  candidates.push("/home/linuxbrew/.linuxbrew/bin/brew");

  // macOS defaults.
  candidates.push("/opt/homebrew/bin/brew", "/usr/local/bin/brew");

  for (const candidate of candidates) {
    if (isExecutable(candidate)) {
      return candidate;
    }
  }

  return undefined;
}
