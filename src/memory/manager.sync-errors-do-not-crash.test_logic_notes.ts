/*
 * AUTO ANNOTATION
 * File: src/memory/manager.sync-errors-do-not-crash.test.ts
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
import { getEmbedBatchMock, resetEmbeddingMocks } from "./embedding.test-mocks.js";
import type { MemoryIndexManager } from "./index.js";
import { getRequiredMemoryIndexManager } from "./test-manager-helpers.js";

describe("memory manager sync failures", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let workspaceDir: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let indexPath: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let manager: MemoryIndexManager | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embedBatch = getEmbedBatchMock();

  beforeEach(async () => {
    vi.useFakeTimers();
    resetEmbeddingMocks();
    embedBatch.mockImplementation(async () => {
      throw new Error("openai embeddings failed: 400 bad request");
    });
    workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-mem-"));
    indexPath = path.join(workspaceDir, "index.sqlite");
    await fs.mkdir(path.join(workspaceDir, "memory"));
    await fs.writeFile(path.join(workspaceDir, "MEMORY.md"), "Hello");
  });

  afterEach(async () => {
    vi.useRealTimers();
    if (manager) {
      await manager.close();
      manager = null;
    }
    await fs.rm(workspaceDir, { recursive: true, force: true });
  });

  it("does not raise unhandledRejection when watch-triggered sync fails", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const unhandled: unknown[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on("unhandledRejection", handler);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: {
          workspace: workspaceDir,
          memorySearch: {
            provider: "openai",
            model: "mock-embed",
            store: { path: indexPath },
            sync: { watch: true, watchDebounceMs: 1, onSessionStart: false, onSearch: false },
          },
        },
        list: [{ id: "main", default: true }],
      },
    } as OpenClawConfig;

    manager = await getRequiredMemoryIndexManager({ cfg, agentId: "main" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const syncSpy = vi.spyOn(manager, "sync");

    // Call the internal scheduler directly; it uses fire-and-forget sync.
    (manager as unknown as { scheduleWatchSync: () => void }).scheduleWatchSync();

    await vi.runOnlyPendingTimersAsync();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const syncPromise = syncSpy.mock.results[0]?.value as Promise<void> | undefined;
    vi.useRealTimers();
    if (syncPromise) {
      await syncPromise.catch(() => undefined);
    }

    process.off("unhandledRejection", handler);
    expect(unhandled).toHaveLength(0);
  });
});
