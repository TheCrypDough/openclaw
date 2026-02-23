/*
 * AUTO ANNOTATION
 * File: src/agents/tools/web-fetch.test-mocks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

// Avoid dynamic-importing heavy readability deps in unit test suites.
vi.mock("./web-fetch-utils.js", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual =
    await vi.importActual<typeof import("./web-fetch-utils.js")>("./web-fetch-utils.js");
  return {
    ...actual,
    extractReadableContent: vi.fn().mockResolvedValue({
      title: "HTML Page",
      text: "HTML Page\n\nContent here.",
    }),
  };
});
