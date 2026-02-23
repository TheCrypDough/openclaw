/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/test-mocks.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

vi.mock("./accounts.js", async () => {
  const { createBlueBubblesAccountsMockModule } = await import("./test-harness.js");
  return createBlueBubblesAccountsMockModule();
});

vi.mock("./probe.js", async () => {
  const { createBlueBubblesProbeMockModule } = await import("./test-harness.js");
  return createBlueBubblesProbeMockModule();
});
