/*
 * AUTO ANNOTATION
 * File: src/memory/sync-index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DatabaseSync } from "node:sqlite";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SyncProgress = {
  completed: number;
  total: number;
  report: (update: { completed: number; total: number; label?: string }) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function tickProgress(progress: SyncProgress | undefined): void {
  if (!progress) {
    return;
  }
  progress.completed += 1;
  progress.report({
    completed: progress.completed,
    total: progress.total,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function indexFileEntryIfChanged<
  TEntry extends { path: string; hash: string },
>(params: {
  db: DatabaseSync;
  source: string;
  needsFullReindex: boolean;
  entry: TEntry;
  indexFile: (entry: TEntry) => Promise<void>;
  progress?: SyncProgress;
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = params.db
    .prepare(`SELECT hash FROM files WHERE path = ? AND source = ?`)
    .get(params.entry.path, params.source) as { hash: string } | undefined;
  if (!params.needsFullReindex && record?.hash === params.entry.hash) {
    tickProgress(params.progress);
    return;
  }
  await params.indexFile(params.entry);
  tickProgress(params.progress);
}
