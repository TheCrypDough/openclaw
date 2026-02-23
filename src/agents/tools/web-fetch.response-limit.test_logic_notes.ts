/*
 * AUTO ANNOTATION
 * File: src/agents/tools/web-fetch.response-limit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { withFetchPreconnect } from "../../test-utils/fetch-mock.js";
import {
  createBaseWebFetchToolConfig,
  installWebFetchSsrfHarness,
} from "./web-fetch.test-harness.js";
import "./web-fetch.test-mocks.js";
import { createWebFetchTool } from "./web-tools.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseToolConfig = createBaseWebFetchToolConfig({ maxResponseBytes: 1024 });
installWebFetchSsrfHarness();

describe("web_fetch response size limits", () => {
  it("caps response bytes and does not hang on endless streams", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunk = new TextEncoder().encode("<html><body><div>hi</div></body></html>");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(chunk);
      },
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const response = new Response(stream, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue(response);
    global.fetch = withFetchPreconnect(fetchSpy);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = createWebFetchTool(baseToolConfig);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool?.execute?.("call", { url: "https://example.com/stream" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const details = result?.details as { warning?: string } | undefined;
    expect(details?.warning).toContain("Response body truncated");
  });
});
