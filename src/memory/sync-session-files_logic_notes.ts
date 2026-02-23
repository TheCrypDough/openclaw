/*
 * AUTO ANNOTATION
 * File: src/memory/sync-session-files.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DatabaseSync } from "node:sqlite";
import { createSubsystemLogger } from "../logging/subsystem.js";
import type { SessionFileEntry } from "./session-files.js";
import {
  buildSessionEntry,
  listSessionFilesForAgent,
  sessionPathForFile,
} from "./session-files.js";
import { indexFileEntryIfChanged } from "./sync-index.js";
import type { SyncProgressState } from "./sync-progress.js";
import { bumpSyncProgressCompleted, bumpSyncProgressTotal } from "./sync-progress.js";
import { deleteStaleIndexedPaths } from "./sync-stale.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("memory");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function syncSessionFiles(params: {
  agentId: string;
  db: DatabaseSync;
  needsFullReindex: boolean;
  progress?: SyncProgressState;
  batchEnabled: boolean;
  concurrency: number;
  runWithConcurrency: <T>(tasks: Array<() => Promise<T>>, concurrency: number) => Promise<T[]>;
  indexFile: (entry: SessionFileEntry) => Promise<void>;
  vectorTable: string;
  ftsTable: string;
  ftsEnabled: boolean;
  ftsAvailable: boolean;
  model: string;
  dirtyFiles: Set<string>;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const files = await listSessionFilesForAgent(params.agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activePaths = new Set(files.map((file) => sessionPathForFile(file)));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const indexAll = params.needsFullReindex || params.dirtyFiles.size === 0;

  log.debug("memory sync: indexing session files", {
    files: files.length,
    indexAll,
    dirtyFiles: params.dirtyFiles.size,
    batch: params.batchEnabled,
    concurrency: params.concurrency,
  });

  bumpSyncProgressTotal(
    params.progress,
    files.length,
    params.batchEnabled ? "Indexing session files (batch)..." : "Indexing session files…",
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tasks = files.map((absPath) => async () => {
    if (!indexAll && !params.dirtyFiles.has(absPath)) {
      bumpSyncProgressCompleted(params.progress);
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = await buildSessionEntry(absPath);
    if (!entry) {
      bumpSyncProgressCompleted(params.progress);
      return;
    }
    await indexFileEntryIfChanged({
      db: params.db,
      source: "sessions",
      needsFullReindex: params.needsFullReindex,
      entry,
      indexFile: params.indexFile,
      progress: params.progress,
    });
  });

  await params.runWithConcurrency(tasks, params.concurrency);
  deleteStaleIndexedPaths({
    db: params.db,
    source: "sessions",
    activePaths,
    vectorTable: params.vectorTable,
    ftsTable: params.ftsTable,
    ftsEnabled: params.ftsEnabled,
    ftsAvailable: params.ftsAvailable,
    model: params.model,
  });
}
