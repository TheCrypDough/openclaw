/*
 * AUTO ANNOTATION
 * File: src/agents/model-compat.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Api, Model } from "@mariozechner/pi-ai";
import { describe, expect, it } from "vitest";
import { normalizeModelCompat } from "./model-compat.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseModel = (): Model<Api> =>
  ({
    id: "glm-4.7",
    name: "GLM-4.7",
    api: "openai-completions",
    provider: "zai",
    baseUrl: "https://api.z.ai/api/coding/paas/v4",
    reasoning: true,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 8192,
    maxTokens: 1024,
  }) as Model<Api>;

describe("normalizeModelCompat", () => {
  it("forces supportsDeveloperRole off for z.ai models", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = baseModel();
    delete (model as { compat?: unknown }).compat;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeModelCompat(model);
    expect(
      (normalized.compat as { supportsDeveloperRole?: boolean } | undefined)?.supportsDeveloperRole,
    ).toBe(false);
  });

  it("leaves non-zai models untouched", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = {
      ...baseModel(),
      provider: "openai",
      baseUrl: "https://api.openai.com/v1",
    };
    delete (model as { compat?: unknown }).compat;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeModelCompat(model);
    expect(normalized.compat).toBeUndefined();
  });

  it("does not override explicit z.ai compat false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = baseModel();
    model.compat = { supportsDeveloperRole: false };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeModelCompat(model);
    expect(
      (normalized.compat as { supportsDeveloperRole?: boolean } | undefined)?.supportsDeveloperRole,
    ).toBe(false);
  });
});
