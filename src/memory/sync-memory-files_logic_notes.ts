/*
 * AUTO ANNOTATION
 * File: src/memory/sync-memory-files.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DatabaseSync } from "node:sqlite";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { buildFileEntry, listMemoryFiles, type MemoryFileEntry } from "./internal.js";
import { indexFileEntryIfChanged } from "./sync-index.js";
import type { SyncProgressState } from "./sync-progress.js";
import { bumpSyncProgressTotal } from "./sync-progress.js";
import { deleteStaleIndexedPaths } from "./sync-stale.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("memory");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function syncMemoryFiles(params: {
  workspaceDir: string;
  extraPaths?: string[];
  db: DatabaseSync;
  needsFullReindex: boolean;
  progress?: SyncProgressState;
  batchEnabled: boolean;
  concurrency: number;
  runWithConcurrency: <T>(tasks: Array<() => Promise<T>>, concurrency: number) => Promise<T[]>;
  indexFile: (entry: MemoryFileEntry) => Promise<void>;
  vectorTable: string;
  ftsTable: string;
  ftsEnabled: boolean;
  ftsAvailable: boolean;
  model: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const files = await listMemoryFiles(params.workspaceDir, params.extraPaths);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileEntries = (
    await Promise.all(files.map(async (file) => buildFileEntry(file, params.workspaceDir)))
  ).filter((entry): entry is MemoryFileEntry => entry !== null);

  log.debug("memory sync: indexing memory files", {
    files: fileEntries.length,
    needsFullReindex: params.needsFullReindex,
    batch: params.batchEnabled,
    concurrency: params.concurrency,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activePaths = new Set(fileEntries.map((entry) => entry.path));
  bumpSyncProgressTotal(
    params.progress,
    fileEntries.length,
    params.batchEnabled ? "Indexing memory files (batch)..." : "Indexing memory files…",
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tasks = fileEntries.map((entry) => async () => {
    await indexFileEntryIfChanged({
      db: params.db,
      source: "memory",
      needsFullReindex: params.needsFullReindex,
      entry,
      indexFile: params.indexFile,
      progress: params.progress,
    });
  });

  await params.runWithConcurrency(tasks, params.concurrency);
  deleteStaleIndexedPaths({
    db: params.db,
    source: "memory",
    activePaths,
    vectorTable: params.vectorTable,
    ftsTable: params.ftsTable,
    ftsEnabled: params.ftsEnabled,
    ftsAvailable: params.ftsAvailable,
    model: params.model,
  });
}
