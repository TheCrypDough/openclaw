/*
 * AUTO ANNOTATION
 * File: src/infra/path-safety.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSafeBaseDir(rootDir: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = path.resolve(rootDir);
  return resolved.endsWith(path.sep) ? resolved : `${resolved}${path.sep}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isWithinDir(rootDir: string, targetPath: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedRoot = path.resolve(rootDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedTarget = path.resolve(targetPath);

  // Windows paths are effectively case-insensitive; normalize to avoid false negatives.
  if (process.platform === "win32") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const relative = path.win32.relative(resolvedRoot.toLowerCase(), resolvedTarget.toLowerCase());
    return relative === "" || (!relative.startsWith("..") && !path.win32.isAbsolute(relative));
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const relative = path.relative(resolvedRoot, resolvedTarget);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
