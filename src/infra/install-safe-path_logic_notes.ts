/*
 * AUTO ANNOTATION
 * File: src/infra/install-safe-path.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createHash } from "node:crypto";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unscopedPackageName(name: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.includes("/") ? (trimmed.split("/").pop() ?? trimmed) : trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function safeDirName(input: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.replaceAll("/", "__").replaceAll("\\", "__");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function safePathSegmentHashed(input: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = trimmed
    .replaceAll(/[\\/]/g, "-")
    .replaceAll(/[^a-zA-Z0-9._-]/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-+/g, "")
    .replaceAll(/-+$/g, "");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = base.length > 0 ? base : "skill";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safe = normalized === "." || normalized === ".." ? "skill" : normalized;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hash = createHash("sha256").update(trimmed).digest("hex").slice(0, 10);

  if (safe !== trimmed) {
    const prefix = safe.length > 50 ? safe.slice(0, 50) : safe;
    return `${prefix}-${hash}`;
  }
  if (safe.length > 60) {
    return `${safe.slice(0, 50)}-${hash}`;
  }
  return safe;
}

export function resolveSafeInstallDir(params: {
  baseDir: string;
  id: string;
  invalidNameMessage: string;
}): { ok: true; path: string } | { ok: false; error: string } {
  const targetDir = path.join(params.baseDir, safeDirName(params.id));
  const resolvedBase = path.resolve(params.baseDir);
  const resolvedTarget = path.resolve(targetDir);
  const relative = path.relative(resolvedBase, resolvedTarget);
  if (
    !relative ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    return { ok: false, error: params.invalidNameMessage };
  }
  return { ok: true, path: targetDir };
}
