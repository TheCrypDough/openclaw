# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.providers.kimi-coding.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { captureEnv } from "../test-utils/env.js";
import { buildKimiCodingProvider, resolveImplicitProviders } from "./models-config.providers.js";

describe("kimi-coding implicit provider (#22409)", () => {
  it("should include kimi-coding when KIMI_API_KEY is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envSnapshot = captureEnv(["KIMI_API_KEY"]);
    process.env.KIMI_API_KEY = "test-key";

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.["kimi-coding"]).toBeDefined();
      expect(providers?.["kimi-coding"]?.api).toBe("anthropic-messages");
      expect(providers?.["kimi-coding"]?.baseUrl).toBe("https://api.kimi.com/coding/");
    } finally {
      envSnapshot.restore();
    }
  });

  it("should build kimi-coding provider with anthropic-messages API", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = buildKimiCodingProvider();
    expect(provider.api).toBe("anthropic-messages");
    expect(provider.baseUrl).toBe("https://api.kimi.com/coding/");
    expect(provider.models).toBeDefined();
    expect(provider.models.length).toBeGreaterThan(0);
    expect(provider.models[0].id).toBe("k2p5");
  });

  it("should not include kimi-coding when no API key is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envSnapshot = captureEnv(["KIMI_API_KEY"]);
    delete process.env.KIMI_API_KEY;

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.["kimi-coding"]).toBeUndefined();
    } finally {
      envSnapshot.restore();
    }
  });
});
