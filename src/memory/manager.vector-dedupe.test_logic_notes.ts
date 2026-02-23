/*
 * AUTO ANNOTATION
 * File: src/memory/manager.vector-dedupe.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import type { MemoryIndexManager } from "./index.js";
import { buildFileEntry } from "./internal.js";
import { createMemoryManagerOrThrow } from "./test-manager.js";

vi.mock("./embeddings.js", () => {
  return {
    createEmbeddingProvider: async () => ({
      requestedProvider: "openai",
      provider: {
        id: "mock",
        model: "mock-embed",
        embedQuery: async () => [0.1, 0.2, 0.3],
        embedBatch: async (texts: string[]) => texts.map((_, index) => [index + 1, 0, 0]),
      },
    }),
  };
});

describe("memory vector dedupe", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let workspaceDir: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let indexPath: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let manager: MemoryIndexManager | null = null;

  beforeEach(async () => {
    workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-mem-"));
    indexPath = path.join(workspaceDir, "index.sqlite");
    await fs.mkdir(path.join(workspaceDir, "memory"));
    await fs.writeFile(path.join(workspaceDir, "MEMORY.md"), "Hello memory.");
  });

  afterEach(async () => {
    if (manager) {
      await manager.close();
      manager = null;
    }
    await fs.rm(workspaceDir, { recursive: true, force: true });
  });

  it("deletes existing vector rows before inserting replacements", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: {
          workspace: workspaceDir,
          memorySearch: {
            provider: "openai",
            model: "mock-embed",
            store: { path: indexPath, vector: { enabled: true } },
            sync: { watch: false, onSessionStart: false, onSearch: false },
            cache: { enabled: false },
          },
        },
        list: [{ id: "main", default: true }],
      },
    } as OpenClawConfig;

    manager = await createMemoryManagerOrThrow(cfg);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const db = (
      manager as unknown as {
        db: { exec: (sql: string) => void; prepare: (sql: string) => unknown };
      }
    ).db;
    db.exec("CREATE TABLE IF NOT EXISTS chunks_vec (id TEXT PRIMARY KEY, embedding BLOB)");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sqlSeen: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const originalPrepare = db.prepare.bind(db);
    db.prepare = (sql: string) => {
      if (sql.includes("chunks_vec")) {
        sqlSeen.push(sql);
      }
      return originalPrepare(sql);
    };

    (
      manager as unknown as { ensureVectorReady: (dims?: number) => Promise<boolean> }
    ).ensureVectorReady = async () => true;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = await buildFileEntry(path.join(workspaceDir, "MEMORY.md"), workspaceDir);
    if (!entry) {
      throw new Error("entry missing");
    }
    await (
      manager as unknown as {
        indexFile: (entry: unknown, options: { source: "memory" }) => Promise<void>;
      }
    ).indexFile(entry, { source: "memory" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deleteIndex = sqlSeen.findIndex((sql) =>
      sql.includes("DELETE FROM chunks_vec WHERE id = ?"),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const insertIndex = sqlSeen.findIndex((sql) => sql.includes("INSERT INTO chunks_vec"));
    expect(deleteIndex).toBeGreaterThan(-1);
    expect(insertIndex).toBeGreaterThan(-1);
    expect(deleteIndex).toBeLessThan(insertIndex);
  });
});
