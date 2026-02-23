/*
 * AUTO ANNOTATION
 * File: src/canvas-host/file-resolver.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { SafeOpenError, openFileWithinRoot, type SafeOpenResult } from "../infra/fs-safe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeUrlPath(rawPath: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const decoded = decodeURIComponent(rawPath || "/");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = path.posix.normalize(decoded);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveFileWithinRoot(
  rootReal: string,
  urlPath: string,
): Promise<SafeOpenResult | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeUrlPath(urlPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = normalized.replace(/^\/+/, "");
  if (rel.split("/").some((p) => p === "..")) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tryOpen = async (relative: string) => {
    try {
      return await openFileWithinRoot({ rootDir: rootReal, relativePath: relative });
    } catch (err) {
      if (err instanceof SafeOpenError) {
        return null;
      }
      throw err;
    }
  };

  if (normalized.endsWith("/")) {
    return await tryOpen(path.posix.join(rel, "index.html"));
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = path.join(rootReal, rel);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const st = await fs.lstat(candidate);
    if (st.isSymbolicLink()) {
      return null;
    }
    if (st.isDirectory()) {
      return await tryOpen(path.posix.join(rel, "index.html"));
    }
  } catch {
    // ignore
  }

  return await tryOpen(rel);
}
