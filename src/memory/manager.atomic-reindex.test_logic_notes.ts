/*
 * AUTO ANNOTATION
 * File: src/memory/manager.atomic-reindex.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { getEmbedBatchMock, resetEmbeddingMocks } from "./embedding.test-mocks.js";
import type { MemoryIndexManager } from "./index.js";
import { getRequiredMemoryIndexManager } from "./test-manager-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let shouldFail = false;

describe("memory manager atomic reindex", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let fixtureRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let caseId = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let workspaceDir: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let indexPath: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let manager: MemoryIndexManager | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embedBatch = getEmbedBatchMock();

  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-mem-atomic-"));
  });

  beforeEach(async () => {
    vi.stubEnv("OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX", "0");
    resetEmbeddingMocks();
    shouldFail = false;
    embedBatch.mockImplementation(async (texts: string[]) => {
      if (shouldFail) {
        throw new Error("embedding failure");
      }
      return texts.map((_, index) => [index + 1, 0, 0]);
    });
    workspaceDir = path.join(fixtureRoot, `case-${caseId++}`);
    await fs.mkdir(workspaceDir, { recursive: true });
    indexPath = path.join(workspaceDir, "index.sqlite");
    await fs.mkdir(path.join(workspaceDir, "memory"));
    await fs.writeFile(path.join(workspaceDir, "MEMORY.md"), "Hello memory.");
  });

  afterEach(async () => {
    if (manager) {
      await manager.close();
      manager = null;
    }
  });

  afterAll(async () => {
    if (!fixtureRoot) {
      return;
    }
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  });

  it("keeps the prior index when a full reindex fails", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: {
          workspace: workspaceDir,
          memorySearch: {
            provider: "openai",
            model: "mock-embed",
            store: { path: indexPath },
            cache: { enabled: false },
            // Perf: keep test indexes to a single chunk to reduce sqlite work.
            chunking: { tokens: 4000, overlap: 0 },
            sync: { watch: false, onSessionStart: false, onSearch: false },
          },
        },
        list: [{ id: "main", default: true }],
      },
    } as OpenClawConfig;

    manager = await getRequiredMemoryIndexManager({ cfg, agentId: "main" });

    await manager.sync({ force: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const beforeStatus = manager.status();
    expect(beforeStatus.chunks).toBeGreaterThan(0);

    shouldFail = true;
    await expect(manager.sync({ force: true })).rejects.toThrow("embedding failure");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const afterStatus = manager.status();
    expect(afterStatus.chunks).toBeGreaterThan(0);
  });
});
