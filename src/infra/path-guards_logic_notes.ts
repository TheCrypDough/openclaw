/*
 * AUTO ANNOTATION
 * File: src/infra/path-guards.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const NOT_FOUND_CODES = new Set(["ENOENT", "ENOTDIR"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SYMLINK_OPEN_CODES = new Set(["ELOOP", "EINVAL", "ENOTSUP"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isNodeError(value: unknown): value is NodeJS.ErrnoException {
  return Boolean(
    value && typeof value === "object" && "code" in (value as Record<string, unknown>),
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasNodeErrorCode(value: unknown, code: string): boolean {
  return isNodeError(value) && value.code === code;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isNotFoundPathError(value: unknown): boolean {
  return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isSymlinkOpenError(value: unknown): boolean {
  return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isPathInside(root: string, target: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedRoot = path.resolve(root);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedTarget = path.resolve(target);

  if (process.platform === "win32") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const relative = path.win32.relative(resolvedRoot.toLowerCase(), resolvedTarget.toLowerCase());
    return relative === "" || (!relative.startsWith("..") && !path.win32.isAbsolute(relative));
  }

  const relative = path.relative(resolvedRoot, resolvedTarget);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
