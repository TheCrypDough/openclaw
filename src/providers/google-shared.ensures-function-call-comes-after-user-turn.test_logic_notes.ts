/*
 * AUTO ANNOTATION
 * File: src/providers/google-shared.ensures-function-call-comes-after-user-turn.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { convertMessages } from "@mariozechner/pi-ai/dist/providers/google-shared.js";
import type { Context } from "@mariozechner/pi-ai/dist/types.js";
import { describe, expect, it } from "vitest";
import {
  asRecord,
  makeGeminiCliAssistantMessage,
  makeGeminiCliModel,
  makeGoogleAssistantMessage,
  makeModel,
} from "./google-shared.test-helpers.js";

describe("google-shared convertTools", () => {
  it("ensures function call comes after user turn, not after model turn", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = makeModel("gemini-1.5-pro");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = {
      messages: [
        {
          role: "user",
          content: "Hello",
        },
        makeGoogleAssistantMessage(model.id, [{ type: "text", text: "Hi!" }]),
        makeGoogleAssistantMessage(model.id, [
          {
            type: "toolCall",
            id: "call_1",
            name: "myTool",
            arguments: {},
          },
        ]),
      ],
    } as unknown as Context;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const contents = convertMessages(model, context);
    expect(contents).toHaveLength(3);
    expect(contents[0].role).toBe("user");
    expect(contents[1].role).toBe("model");
    expect(contents[2].role).toBe("model");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCallPart = contents[2].parts?.find(
      (part) => typeof part === "object" && part !== null && "functionCall" in part,
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCall = asRecord(toolCallPart);
    expect(toolCall.functionCall).toBeTruthy();
  });

  it("strips tool call and response ids for google-gemini-cli", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = makeGeminiCliModel("gemini-3-flash");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = {
      messages: [
        {
          role: "user",
          content: "Use a tool",
        },
        makeGeminiCliAssistantMessage(model.id, [
          {
            type: "toolCall",
            id: "call_1",
            name: "myTool",
            arguments: { arg: "value" },
            thoughtSignature: "dGVzdA==",
          },
        ]),
        {
          role: "toolResult",
          toolCallId: "call_1",
          toolName: "myTool",
          content: [{ type: "text", text: "Tool result" }],
          isError: false,
          timestamp: 0,
        },
      ],
    } as unknown as Context;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const contents = convertMessages(model, context);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parts = contents.flatMap((content) => content.parts ?? []);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolCallPart = parts.find(
      (part) => typeof part === "object" && part !== null && "functionCall" in part,
    );
    const toolResponsePart = parts.find(
      (part) => typeof part === "object" && part !== null && "functionResponse" in part,
    );

    const toolCall = asRecord(toolCallPart);
    const toolResponse = asRecord(toolResponsePart);

    expect(asRecord(toolCall.functionCall).id).toBeUndefined();
    expect(asRecord(toolResponse.functionResponse).id).toBeUndefined();
  });
});
