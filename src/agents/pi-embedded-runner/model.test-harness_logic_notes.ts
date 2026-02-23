/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/model.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import type { ModelDefinitionConfig } from "../../config/types.js";
import { discoverModels } from "../pi-model-discovery.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const makeModel = (id: string): ModelDefinitionConfig => ({
  id,
  name: id,
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1,
  maxTokens: 1,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const OPENAI_CODEX_TEMPLATE_MODEL = {
  id: "gpt-5.2-codex",
  name: "GPT-5.2 Codex",
  provider: "openai-codex",
  api: "openai-codex-responses",
  baseUrl: "https://chatgpt.com/backend-api",
  reasoning: true,
  input: ["text", "image"] as const,
  cost: { input: 1.75, output: 14, cacheRead: 0.175, cacheWrite: 0 },
  contextWindow: 272000,
  maxTokens: 128000,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetMockDiscoverModels(): void {
  vi.mocked(discoverModels).mockReturnValue({
    find: vi.fn(() => null),
  } as unknown as ReturnType<typeof discoverModels>);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mockDiscoveredModel(params: {
  provider: string;
  modelId: string;
  templateModel: unknown;
}): void {
  vi.mocked(discoverModels).mockReturnValue({
    find: vi.fn((provider: string, modelId: string) => {
      if (provider === params.provider && modelId === params.modelId) {
        return params.templateModel;
      }
      return null;
    }),
  } as unknown as ReturnType<typeof discoverModels>);
}
