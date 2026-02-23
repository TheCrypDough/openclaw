/*
 * AUTO ANNOTATION
 * File: src/agents/tools/memory-tool.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SearchImpl = () => Promise<unknown[]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let searchImpl: SearchImpl = async () => [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const stubManager = {
  search: vi.fn(async () => await searchImpl()),
  readFile: vi.fn(),
  status: () => ({
    backend: "builtin" as const,
    files: 1,
    chunks: 1,
    dirty: false,
    workspaceDir: "/workspace",
    dbPath: "/workspace/.memory/index.sqlite",
    provider: "builtin",
    model: "builtin",
    requestedProvider: "builtin",
    sources: ["memory" as const],
    sourceCounts: [{ source: "memory" as const, files: 1, chunks: 1 }],
  }),
  sync: vi.fn(),
  probeVectorAvailability: vi.fn(async () => true),
  close: vi.fn(),
};

vi.mock("../../memory/index.js", () => ({
  getMemorySearchManager: async () => ({ manager: stubManager }),
}));

import { createMemorySearchTool } from "./memory-tool.js";

describe("memory_search unavailable payloads", () => {
  beforeEach(() => {
    searchImpl = async () => [];
    vi.clearAllMocks();
  });

  it("returns explicit unavailable metadata for quota failures", async () => {
    searchImpl = async () => {
      throw new Error("openai embeddings failed: 429 insufficient_quota");
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = createMemorySearchTool({
      config: { agents: { list: [{ id: "main", default: true }] } },
    });
    if (!tool) {
      throw new Error("tool missing");
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool.execute("quota", { query: "hello" });
    expect(result.details).toEqual({
      results: [],
      disabled: true,
      unavailable: true,
      error: "openai embeddings failed: 429 insufficient_quota",
      warning: "Memory search is unavailable because the embedding provider quota is exhausted.",
      action: "Top up or switch embedding provider, then retry memory_search.",
    });
  });

  it("returns explicit unavailable metadata for non-quota failures", async () => {
    searchImpl = async () => {
      throw new Error("embedding provider timeout");
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = createMemorySearchTool({
      config: { agents: { list: [{ id: "main", default: true }] } },
    });
    if (!tool) {
      throw new Error("tool missing");
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool.execute("generic", { query: "hello" });
    expect(result.details).toEqual({
      results: [],
      disabled: true,
      unavailable: true,
      error: "embedding provider timeout",
      warning: "Memory search is unavailable due to an embedding/provider error.",
      action: "Check embedding provider configuration and retry memory_search.",
    });
  });
});
