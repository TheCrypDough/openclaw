/*
 * AUTO ANNOTATION
 * File: src/plugins/path-safety.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathInside(baseDir: string, targetPath: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = path.relative(baseDir, targetPath);
  if (!rel) {
    return true;
  }
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function safeRealpathSync(targetPath: string, cache?: Map<string, string>): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = cache?.get(targetPath);
  if (cached) {
    return cached;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = fs.realpathSync(targetPath);
    cache?.set(targetPath, resolved);
    return resolved;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function safeStatSync(targetPath: string): fs.Stats | null {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatPosixMode(mode: number): string {
  return (mode & 0o777).toString(8).padStart(3, "0");
}
