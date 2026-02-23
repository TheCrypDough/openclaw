/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/extra-params.zai-tool-stream.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { Context, Model, SimpleStreamOptions } from "@mariozechner/pi-ai";
import { describe, expect, it, vi } from "vitest";
import { applyExtraParamsToAgent } from "./extra-params.js";

// Mock streamSimple for testing
vi.mock("@mariozechner/pi-ai", () => ({
  streamSimple: vi.fn(() => ({
    push: vi.fn(),
    result: vi.fn(),
  })),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolStreamCase = {
  applyProvider: string;
  applyModelId: string;
  model: Model<"openai-completions">;
  cfg?: Parameters<typeof applyExtraParamsToAgent>[1];
  options?: SimpleStreamOptions;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function runToolStreamCase(params: ToolStreamCase) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload: Record<string, unknown> = { model: params.model.id, messages: [] };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseStreamFn: StreamFn = (_model, _context, options) => {
    options?.onPayload?.(payload);
    return {} as ReturnType<StreamFn>;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agent = { streamFn: baseStreamFn };

  applyExtraParamsToAgent(agent, params.cfg, params.applyProvider, params.applyModelId);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const context: Context = { messages: [] };
  void agent.streamFn?.(params.model, context, params.options ?? {});

  return payload;
}

describe("extra-params: Z.AI tool_stream support", () => {
  it("injects tool_stream=true for zai provider by default", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = runToolStreamCase({
      applyProvider: "zai",
      applyModelId: "glm-5",
      model: {
        api: "openai-completions",
        provider: "zai",
        id: "glm-5",
      } as Model<"openai-completions">,
    });

    expect(payload.tool_stream).toBe(true);
  });

  it("does not inject tool_stream for non-zai providers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = runToolStreamCase({
      applyProvider: "openai",
      applyModelId: "gpt-5",
      model: {
        api: "openai-completions",
        provider: "openai",
        id: "gpt-5",
      } as Model<"openai-completions">,
    });

    expect(payload).not.toHaveProperty("tool_stream");
  });

  it("allows disabling tool_stream via params", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = runToolStreamCase({
      applyProvider: "zai",
      applyModelId: "glm-5",
      model: {
        api: "openai-completions",
        provider: "zai",
        id: "glm-5",
      } as Model<"openai-completions">,
      cfg: {
        agents: {
          defaults: {
            models: {
              "zai/glm-5": {
                params: {
                  tool_stream: false,
                },
              },
            },
          },
        },
      },
    });

    expect(payload).not.toHaveProperty("tool_stream");
  });
});
