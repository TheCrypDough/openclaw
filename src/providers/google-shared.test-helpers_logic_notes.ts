/*
 * AUTO ANNOTATION
 * File: src/providers/google-shared.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Model } from "@mariozechner/pi-ai/dist/types.js";
import { expect } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const asRecord = (value: unknown): Record<string, unknown> => {
  expect(value).toBeTruthy();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);
  return value as Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConvertedTools = ReadonlyArray<{
  functionDeclarations?: ReadonlyArray<{
    parametersJsonSchema?: unknown;
    parameters?: unknown;
  }>;
}>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getFirstToolParameters = (converted: ConvertedTools): Record<string, unknown> => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const functionDeclaration = asRecord(converted?.[0]?.functionDeclarations?.[0]);
  return asRecord(functionDeclaration.parametersJsonSchema ?? functionDeclaration.parameters);
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const makeModel = (id: string): Model<"google-generative-ai"> =>
  ({
    id,
    name: id,
    api: "google-generative-ai",
    provider: "google",
    baseUrl: "https://example.invalid",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 1,
    maxTokens: 1,
  }) as Model<"google-generative-ai">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const makeGeminiCliModel = (id: string): Model<"google-gemini-cli"> =>
  ({
    id,
    name: id,
    api: "google-gemini-cli",
    provider: "google-gemini-cli",
    baseUrl: "https://example.invalid",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 1,
    maxTokens: 1,
  }) as Model<"google-gemini-cli">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeZeroUsage() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeGoogleAssistantMessage(model: string, content: unknown) {
  return {
    role: "assistant",
    content,
    api: "google-generative-ai",
    provider: "google",
    model,
    usage: makeZeroUsage(),
    stopReason: "stop",
    timestamp: 0,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeGeminiCliAssistantMessage(model: string, content: unknown) {
  return {
    role: "assistant",
    content,
    api: "google-gemini-cli",
    provider: "google-gemini-cli",
    model,
    usage: makeZeroUsage(),
    stopReason: "stop",
    timestamp: 0,
  };
}
