/*
 * AUTO ANNOTATION
 * File: src/agents/google-gemini-switch.live.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { completeSimple, getModel } from "@mariozechner/pi-ai";
import { Type } from "@sinclair/typebox";
import { describe, expect, it } from "vitest";
import { isTruthyEnvValue } from "../infra/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const GEMINI_KEY = process.env.GEMINI_API_KEY ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LIVE = isTruthyEnvValue(process.env.GEMINI_LIVE_TEST) || isTruthyEnvValue(process.env.LIVE);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeLive = LIVE && GEMINI_KEY ? describe : describe.skip;

describeLive("gemini live switch", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const googleModels = ["gemini-3-pro-preview", "gemini-2.5-pro"] as const;

  for (const modelId of googleModels) {
    it(`handles unsigned tool calls from Antigravity when switching to ${modelId}`, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const model = getModel("google", modelId);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await completeSimple(
        model,
        {
          messages: [
            {
              role: "user",
              content: "Reply with ok.",
              timestamp: now,
            },
            {
              role: "assistant",
              content: [
                {
                  type: "toolCall",
                  id: "call_1",
                  name: "bash",
                  arguments: { command: "ls -la" },
                  // No thoughtSignature: simulates Claude via Antigravity.
                },
              ],
              api: "google-gemini-cli",
              provider: "google-antigravity",
              model: "claude-sonnet-4-20250514",
              usage: {
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
              },
              stopReason: "stop",
              timestamp: now,
            },
          ],
          tools: [
            {
              name: "bash",
              description: "Run shell command",
              parameters: Type.Object({
                command: Type.String(),
              }),
            },
          ],
        },
        {
          apiKey: GEMINI_KEY,
          reasoning: "low",
          maxTokens: 128,
        },
      );

      expect(res.stopReason).not.toBe("error");
    }, 20000);
  }
});
