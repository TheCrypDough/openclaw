/*
 * AUTO ANNOTATION
 * File: src/memory/manager.embedding-batches.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { installEmbeddingManagerFixture } from "./embedding-manager.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const fx = installEmbeddingManagerFixture({
  fixturePrefix: "openclaw-mem-",
  largeTokens: 1250,
  smallTokens: 200,
  createCfg: ({ workspaceDir, indexPath, tokens }) => ({
    agents: {
      defaults: {
        workspace: workspaceDir,
        memorySearch: {
          provider: "openai",
          model: "mock-embed",
          store: { path: indexPath, vector: { enabled: false } },
          chunking: { tokens, overlap: 0 },
          sync: { watch: false, onSessionStart: false, onSearch: false },
          query: { minScore: 0, hybrid: { enabled: false } },
        },
      },
      list: [{ id: "main", default: true }],
    },
  }),
});
const { embedBatch } = fx;

describe("memory embedding batches", () => {
  it("splits large files across multiple embedding batches", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const memoryDir = fx.getMemoryDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const managerLarge = fx.getManagerLarge();
    // Keep this small but above the embedding batch byte threshold (8k) so we
    // exercise multi-batch behavior without generating lots of chunks/DB rows.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = "a".repeat(4200);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = [line, line].join("\n");
    await fs.writeFile(path.join(memoryDir, "2026-01-03.md"), content);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const updates: Array<{ completed: number; total: number; label?: string }> = [];
    await managerLarge.sync({
      progress: (update) => {
        updates.push(update);
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const status = managerLarge.status();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const totalTexts = embedBatch.mock.calls.reduce(
      (sum: number, call: unknown[]) => sum + ((call[0] as string[] | undefined)?.length ?? 0),
      0,
    );
    expect(totalTexts).toBe(status.chunks);
    expect(embedBatch.mock.calls.length).toBeGreaterThan(1);
    expect(updates.length).toBeGreaterThan(0);
    expect(updates.some((update) => update.label?.includes("/"))).toBe(true);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const last = updates[updates.length - 1];
    expect(last?.total).toBeGreaterThan(0);
    expect(last?.completed).toBe(last?.total);
  });

  it("keeps small files in a single embedding batch", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const memoryDir = fx.getMemoryDir();
    const managerSmall = fx.getManagerSmall();
    const line = "b".repeat(120);
    const content = Array.from({ length: 4 }, () => line).join("\n");
    await fs.writeFile(path.join(memoryDir, "2026-01-04.md"), content);
    await managerSmall.sync({ reason: "test" });

    expect(embedBatch.mock.calls.length).toBe(1);
  });

  it("retries embeddings on transient rate limit and 5xx errors", async () => {
    const memoryDir = fx.getMemoryDir();
    const managerSmall = fx.getManagerSmall();
    const line = "d".repeat(120);
    const content = Array.from({ length: 4 }, () => line).join("\n");
    await fs.writeFile(path.join(memoryDir, "2026-01-06.md"), content);

    const transientErrors = [
      "openai embeddings failed: 429 rate limit",
      "openai embeddings failed: 502 Bad Gateway (cloudflare)",
    ];
    let calls = 0;
    embedBatch.mockImplementation(async (texts: string[]) => {
      calls += 1;
      const transient = transientErrors[calls - 1];
      if (transient) {
        throw new Error(transient);
      }
      return texts.map(() => [0, 1, 0]);
    });

    const realSetTimeout = setTimeout;
    const setTimeoutSpy = vi.spyOn(global, "setTimeout").mockImplementation(((
      handler: TimerHandler,
      timeout?: number,
      ...args: unknown[]
    ) => {
      const delay = typeof timeout === "number" ? timeout : 0;
      if (delay > 0 && delay <= 2000) {
        return realSetTimeout(handler, 0, ...args);
      }
      return realSetTimeout(handler, delay, ...args);
    }) as typeof setTimeout);
    try {
      await managerSmall.sync({ reason: "test" });
    } finally {
      setTimeoutSpy.mockRestore();
    }

    expect(calls).toBe(3);
  }, 10000);

  it("skips empty chunks so embeddings input stays valid", async () => {
    const memoryDir = fx.getMemoryDir();
    const managerSmall = fx.getManagerSmall();
    await fs.writeFile(path.join(memoryDir, "2026-01-07.md"), "\n\n\n");
    await managerSmall.sync({ reason: "test" });

    const inputs = embedBatch.mock.calls.flatMap((call: unknown[]) => (call[0] as string[]) ?? []);
    expect(inputs).not.toContain("");
  });
});
