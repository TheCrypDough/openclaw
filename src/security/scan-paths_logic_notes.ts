/*
 * AUTO ANNOTATION
 * File: src/security/scan-paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathInside(basePath: string, candidatePath: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = path.resolve(basePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = path.resolve(candidatePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = path.relative(base, candidate);
  return rel === "" || (!rel.startsWith(`..${path.sep}`) && rel !== ".." && !path.isAbsolute(rel));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function safeRealpathSync(filePath: string): string | null {
  try {
    return fs.realpathSync(filePath);
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathInsideWithRealpath(
  basePath: string,
  candidatePath: string,
  opts?: { requireRealpath?: boolean },
): boolean {
  if (!isPathInside(basePath, candidatePath)) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseReal = safeRealpathSync(basePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidateReal = safeRealpathSync(candidatePath);
  if (!baseReal || !candidateReal) {
    return opts?.requireRealpath !== true;
  }
  return isPathInside(baseReal, candidateReal);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extensionUsesSkippedScannerPath(entry: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const segments = entry.split(/[\\/]+/).filter(Boolean);
  return segments.some(
    (segment) =>
      segment === "node_modules" ||
      (segment.startsWith(".") && segment !== "." && segment !== ".."),
  );
}
