/*
 * AUTO ANNOTATION
 * File: src/agents/model-catalog.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { loadModelCatalog } from "./model-catalog.js";
import {
  installModelCatalogTestHooks,
  mockCatalogImportFailThenRecover,
} from "./model-catalog.test-harness.js";

describe("loadModelCatalog e2e smoke", () => {
  installModelCatalogTestHooks();

  it("recovers after an import failure on the next load", async () => {
    mockCatalogImportFailThenRecover();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {} as OpenClawConfig;
    expect(await loadModelCatalog({ config: cfg })).toEqual([]);
    expect(await loadModelCatalog({ config: cfg })).toEqual([
      { id: "gpt-4.1", name: "GPT-4.1", provider: "openai" },
    ]);
  });
});
