# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.providers.nvidia.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import { resolveApiKeyForProvider } from "./model-auth.js";
import { buildNvidiaProvider, resolveImplicitProviders } from "./models-config.providers.js";

describe("NVIDIA provider", () => {
  it("should include nvidia when NVIDIA_API_KEY is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ NVIDIA_API_KEY: "test-key" }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.nvidia).toBeDefined();
      expect(providers?.nvidia?.models?.length).toBeGreaterThan(0);
    });
  });

  it("resolves the nvidia api key value from env", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ NVIDIA_API_KEY: "nvidia-test-api-key" }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const auth = await resolveApiKeyForProvider({
        provider: "nvidia",
        agentDir,
      });

      expect(auth.apiKey).toBe("nvidia-test-api-key");
      expect(auth.mode).toBe("api-key");
      expect(auth.source).toContain("NVIDIA_API_KEY");
    });
  });

  it("should build nvidia provider with correct configuration", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = buildNvidiaProvider();
    expect(provider.baseUrl).toBe("https://integrate.api.nvidia.com/v1");
    expect(provider.api).toBe("openai-completions");
    expect(provider.models).toBeDefined();
    expect(provider.models.length).toBeGreaterThan(0);
  });

  it("should include default nvidia models", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = buildNvidiaProvider();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const modelIds = provider.models.map((m) => m.id);
    expect(modelIds).toContain("nvidia/llama-3.1-nemotron-70b-instruct");
    expect(modelIds).toContain("meta/llama-3.3-70b-instruct");
    expect(modelIds).toContain("nvidia/mistral-nemo-minitron-8b-8k-instruct");
  });
});

describe("MiniMax implicit provider (#15275)", () => {
  it("should use anthropic-messages API for API-key provider", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ MINIMAX_API_KEY: "test-key" }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.minimax).toBeDefined();
      expect(providers?.minimax?.api).toBe("anthropic-messages");
      expect(providers?.minimax?.baseUrl).toBe("https://api.minimax.io/anthropic");
    });
  });
});

describe("vLLM provider", () => {
  it("should not include vllm when no API key is configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ VLLM_API_KEY: undefined }, async () => {
      const providers = await resolveImplicitProviders({ agentDir });
      expect(providers?.vllm).toBeUndefined();
    });
  });

  it("should include vllm when VLLM_API_KEY is set", async () => {
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ VLLM_API_KEY: "test-key" }, async () => {
      const providers = await resolveImplicitProviders({ agentDir });

      expect(providers?.vllm).toBeDefined();
      expect(providers?.vllm?.apiKey).toBe("VLLM_API_KEY");
      expect(providers?.vllm?.baseUrl).toBe("http://127.0.0.1:8000/v1");
      expect(providers?.vllm?.api).toBe("openai-completions");

      // Note: discovery is disabled in test environments (VITEST check)
      expect(providers?.vllm?.models).toEqual([]);
    });
  });
});
