# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.providers.volcengine-byteplus.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { captureEnv } from "../test-utils/env.js";
import { resolveImplicitProviders } from "./models-config.providers.js";

describe("Volcengine and BytePlus providers", () => {
  it("includes volcengine and volcengine-plan when VOLCANO_ENGINE_API_KEY is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envSnapshot = captureEnv(["VOLCANO_ENGINE_API_KEY"]);
    process.env.VOLCANO_ENGINE_API_KEY = "test-key";

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.volcengine).toBeDefined();
      expect(providers?.["volcengine-plan"]).toBeDefined();
      expect(providers?.volcengine?.apiKey).toBe("VOLCANO_ENGINE_API_KEY");
      expect(providers?.["volcengine-plan"]?.apiKey).toBe("VOLCANO_ENGINE_API_KEY");
    } finally {
      envSnapshot.restore();
    }
  });

  it("includes byteplus and byteplus-plan when BYTEPLUS_API_KEY is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envSnapshot = captureEnv(["BYTEPLUS_API_KEY"]);
    process.env.BYTEPLUS_API_KEY = "test-key";

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.byteplus).toBeDefined();
      expect(providers?.["byteplus-plan"]).toBeDefined();
      expect(providers?.byteplus?.apiKey).toBe("BYTEPLUS_API_KEY");
      expect(providers?.["byteplus-plan"]?.apiKey).toBe("BYTEPLUS_API_KEY");
    } finally {
      envSnapshot.restore();
    }
  });
});
