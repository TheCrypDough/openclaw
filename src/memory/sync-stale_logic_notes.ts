/*
 * AUTO ANNOTATION
 * File: src/memory/sync-stale.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DatabaseSync } from "node:sqlite";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function deleteStaleIndexedPaths(params: {
  db: DatabaseSync;
  source: string;
  activePaths: Set<string>;
  vectorTable: string;
  ftsTable: string;
  ftsEnabled: boolean;
  ftsAvailable: boolean;
  model: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const staleRows = params.db
    .prepare(`SELECT path FROM files WHERE source = ?`)
    .all(params.source) as Array<{ path: string }>;

  for (const stale of staleRows) {
    if (params.activePaths.has(stale.path)) {
      continue;
    }
    params.db
      .prepare(`DELETE FROM files WHERE path = ? AND source = ?`)
      .run(stale.path, params.source);
    try {
      params.db
        .prepare(
          `DELETE FROM ${params.vectorTable} WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)`,
        )
        .run(stale.path, params.source);
    } catch {}
    params.db
      .prepare(`DELETE FROM chunks WHERE path = ? AND source = ?`)
      .run(stale.path, params.source);
    if (params.ftsEnabled && params.ftsAvailable) {
      try {
        params.db
          .prepare(`DELETE FROM ${params.ftsTable} WHERE path = ? AND source = ? AND model = ?`)
          .run(stale.path, params.source, params.model);
      } catch {}
    }
  }
}
