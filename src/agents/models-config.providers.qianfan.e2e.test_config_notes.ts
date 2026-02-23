# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.providers.qianfan.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import { resolveImplicitProviders } from "./models-config.providers.js";

describe("Qianfan provider", () => {
  it("should include qianfan when QIANFAN_API_KEY is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ QIANFAN_API_KEY: "test-key" }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.qianfan).toBeDefined();
      expect(providers?.qianfan?.apiKey).toBe("QIANFAN_API_KEY");
    });
  });
});
