# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.normalizes-gemini-3-ids-preview-google-providers.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { installModelsConfigTestHooks, withModelsTempHome } from "./models-config.e2e-harness.js";

describe("models-config", () => {
  installModelsConfigTestHooks();

  it("normalizes gemini 3 ids to preview for google providers", async () => {
    await withModelsTempHome(async () => {
      const { ensureOpenClawModelsJson } = await import("./models-config.js");
      const { resolveOpenClawAgentDir } = await import("./agent-paths.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg: OpenClawConfig = {
        models: {
          providers: {
            google: {
              baseUrl: "https://generativelanguage.googleapis.com/v1beta",
              apiKey: "GEMINI_KEY",
              api: "google-generative-ai",
              models: [
                {
                  id: "gemini-3-pro",
                  name: "Gemini 3 Pro",
                  api: "google-generative-ai",
                  reasoning: true,
                  input: ["text", "image"],
                  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                  contextWindow: 1048576,
                  maxTokens: 65536,
                },
                {
                  id: "gemini-3-flash",
                  name: "Gemini 3 Flash",
                  api: "google-generative-ai",
                  reasoning: false,
                  input: ["text", "image"],
                  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                  contextWindow: 1048576,
                  maxTokens: 65536,
                },
              ],
            },
          },
        },
      };

      await ensureOpenClawModelsJson(cfg);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const modelPath = path.join(resolveOpenClawAgentDir(), "models.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const raw = await fs.readFile(modelPath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parsed = JSON.parse(raw) as {
        providers: Record<string, { models: Array<{ id: string }> }>;
      };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const ids = parsed.providers.google?.models?.map((model) => model.id);
      expect(ids).toEqual(["gemini-3-pro-preview", "gemini-3-flash-preview"]);
    });
  });
});
