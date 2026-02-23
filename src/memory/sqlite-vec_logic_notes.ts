/*
 * AUTO ANNOTATION
 * File: src/memory/sqlite-vec.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DatabaseSync } from "node:sqlite";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadSqliteVecExtension(params: {
  db: DatabaseSync;
  extensionPath?: string;
}): Promise<{ ok: boolean; extensionPath?: string; error?: string }> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sqliteVec = await import("sqlite-vec");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedPath = params.extensionPath?.trim() ? params.extensionPath.trim() : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const extensionPath = resolvedPath ?? sqliteVec.getLoadablePath();

    params.db.enableLoadExtension(true);
    if (resolvedPath) {
      params.db.loadExtension(extensionPath);
    } else {
      sqliteVec.load(params.db);
    }

    return { ok: true, extensionPath };
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
