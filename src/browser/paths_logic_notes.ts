/*
 * AUTO ANNOTATION
 * File: src/browser/paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { SafeOpenError, openFileWithinRoot } from "../infra/fs-safe.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_TMP_DIR = resolvePreferredOpenClawTmpDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_TRACE_DIR = DEFAULT_BROWSER_TMP_DIR;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_DOWNLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "downloads");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_UPLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "uploads");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePathWithinRoot(params: {
  rootDir: string;
  requestedPath: string;
  scopeLabel: string;
  defaultFileName?: string;
}): { ok: true; path: string } | { ok: false; error: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = path.resolve(params.rootDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = params.requestedPath.trim();
  if (!raw) {
    if (!params.defaultFileName) {
      return { ok: false, error: "path is required" };
    }
    return { ok: true, path: path.join(root, params.defaultFileName) };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = path.resolve(root, raw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = path.relative(root, resolved);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    return { ok: false, error: `Invalid path: must stay within ${params.scopeLabel}` };
  }
  return { ok: true, path: resolved };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePathsWithinRoot(params: {
  rootDir: string;
  requestedPaths: string[];
  scopeLabel: string;
}): { ok: true; paths: string[] } | { ok: false; error: string } {
  const resolvedPaths: string[] = [];
  for (const raw of params.requestedPaths) {
    const pathResult = resolvePathWithinRoot({
      rootDir: params.rootDir,
      requestedPath: raw,
      scopeLabel: params.scopeLabel,
    });
    if (!pathResult.ok) {
      return { ok: false, error: pathResult.error };
    }
    resolvedPaths.push(pathResult.path);
  }
  return { ok: true, paths: resolvedPaths };
}

export async function resolveExistingPathsWithinRoot(params: {
  rootDir: string;
  requestedPaths: string[];
  scopeLabel: string;
}): Promise<{ ok: true; paths: string[] } | { ok: false; error: string }> {
  const resolvedPaths: string[] = [];
  for (const raw of params.requestedPaths) {
    const pathResult = resolvePathWithinRoot({
      rootDir: params.rootDir,
      requestedPath: raw,
      scopeLabel: params.scopeLabel,
    });
    if (!pathResult.ok) {
      return { ok: false, error: pathResult.error };
    }

    const rootDir = path.resolve(params.rootDir);
    const relativePath = path.relative(rootDir, pathResult.path);
    let opened: Awaited<ReturnType<typeof openFileWithinRoot>> | undefined;
    try {
      opened = await openFileWithinRoot({
        rootDir,
        relativePath,
      });
      resolvedPaths.push(opened.realPath);
    } catch (err) {
      if (err instanceof SafeOpenError && err.code === "not-found") {
        // Preserve historical behavior for paths that do not exist yet.
        resolvedPaths.push(pathResult.path);
        continue;
      }
      return {
        ok: false,
        error: `Invalid path: must stay within ${params.scopeLabel} and be a regular non-symlink file`,
      };
    } finally {
      await opened?.handle.close().catch(() => {});
    }
  }
  return { ok: true, paths: resolvedPaths };
}
