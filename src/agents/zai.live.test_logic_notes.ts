/*
 * AUTO ANNOTATION
 * File: src/agents/zai.live.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { completeSimple, getModel } from "@mariozechner/pi-ai";
import { describe, expect, it } from "vitest";
import { isTruthyEnvValue } from "../infra/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ZAI_KEY = process.env.ZAI_API_KEY ?? process.env.Z_AI_API_KEY ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LIVE = isTruthyEnvValue(process.env.ZAI_LIVE_TEST) || isTruthyEnvValue(process.env.LIVE);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeLive = LIVE && ZAI_KEY ? describe : describe.skip;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectModelReturnsAssistantText(modelId: "glm-4.7" | "glm-4.7-flashx") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = getModel("zai", modelId as "glm-4.7");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await completeSimple(
    model,
    {
      messages: [
        {
          role: "user",
          content: "Reply with the word ok.",
          timestamp: Date.now(),
        },
      ],
    },
    { apiKey: ZAI_KEY, maxTokens: 64 },
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = res.content
    .filter((block) => block.type === "text")
    .map((block) => block.text.trim())
    .join(" ");
  expect(text.length).toBeGreaterThan(0);
}

describeLive("zai live", () => {
  it("returns assistant text", async () => {
    await expectModelReturnsAssistantText("glm-4.7");
  }, 20000);

  it("glm-4.7-flashx returns assistant text", async () => {
    await expectModelReturnsAssistantText("glm-4.7-flashx");
  }, 20000);
});
