/*
 * AUTO ANNOTATION
 * File: src/memory/embedding.test-mocks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import "./test-runtime-mocks.js";

// Avoid exporting vitest mock types (TS2742 under pnpm + d.ts emit).
// oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AnyMock = any;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hoisted = vi.hoisted(() => ({
  embedBatch: vi.fn(async (texts: string[]) => texts.map(() => [0, 1, 0])),
  embedQuery: vi.fn(async () => [0, 1, 0]),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getEmbedBatchMock(): AnyMock {
  return hoisted.embedBatch;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getEmbedQueryMock(): AnyMock {
  return hoisted.embedQuery;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetEmbeddingMocks(): void {
  hoisted.embedBatch.mockReset();
  hoisted.embedQuery.mockReset();
  hoisted.embedBatch.mockImplementation(async (texts: string[]) => texts.map(() => [0, 1, 0]));
  hoisted.embedQuery.mockImplementation(async () => [0, 1, 0]);
}

vi.mock("./embeddings.js", () => ({
  createEmbeddingProvider: async () => ({
    requestedProvider: "openai",
    provider: {
      id: "mock",
      model: "mock-embed",
      maxInputTokens: 8192,
      embedQuery: hoisted.embedQuery,
      embedBatch: hoisted.embedBatch,
    },
  }),
}));
