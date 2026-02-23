/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner-extraparams.live.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Model } from "@mariozechner/pi-ai";
import { getModel, streamSimple } from "@mariozechner/pi-ai";
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { isTruthyEnvValue } from "../infra/env.js";
import { applyExtraParamsToAgent } from "./pi-embedded-runner.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LIVE = isTruthyEnvValue(process.env.OPENAI_LIVE_TEST) || isTruthyEnvValue(process.env.LIVE);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeLive = LIVE && OPENAI_KEY ? describe : describe.skip;

describeLive("pi embedded extra params (live)", () => {
  it("applies config maxTokens to openai streamFn", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = getModel("openai", "gpt-5.2") as unknown as Model<"openai-completions">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      agents: {
        defaults: {
          models: {
            "openai/gpt-5.2": {
              // OpenAI Responses enforces a minimum max_output_tokens of 16.
              params: {
                maxTokens: 16,
              },
            },
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = { streamFn: streamSimple };

    applyExtraParamsToAgent(agent, cfg, "openai", model.id);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = agent.streamFn(
      model,
      {
        messages: [
          {
            role: "user",
            content: "Write the alphabet letters A through Z as words separated by commas.",
            timestamp: Date.now(),
          },
        ],
      },
      { apiKey: OPENAI_KEY },
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let stopReason: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let outputTokens: number | undefined;
    for await (const event of stream) {
      if (event.type === "done") {
        stopReason = event.reason;
        outputTokens = event.message.usage.output;
      }
    }

    expect(stopReason).toBeDefined();
    expect(outputTokens).toBeDefined();
    // Should respect maxTokens from config (16) — allow a small buffer for provider rounding.
    expect(outputTokens ?? 0).toBeLessThanOrEqual(20);
  }, 30_000);
});
