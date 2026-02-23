/*
 * AUTO ANNOTATION
 * File: src/agents/openclaw-tools.subagents.sessions-spawn-applies-thinking-default.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createSessionsSpawnTool } from "./tools/sessions-spawn-tool.js";

vi.mock("../config/config.js", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await vi.importActual("../config/config.js");
  return {
    ...actual,
    loadConfig: () => ({
      agents: {
        defaults: {
          subagents: {
            thinking: "high",
          },
        },
      },
      routing: {
        sessions: {
          mainKey: "agent:test:main",
        },
      },
    }),
  };
});

vi.mock("../gateway/call.js", () => {
  return {
    callGateway: vi.fn(async ({ method }: { method: string }) => {
      if (method === "agent") {
        return { runId: "run-123" };
      }
      return {};
    }),
  };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type GatewayCall = { method: string; params?: Record<string, unknown> };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function getGatewayCalls(): Promise<GatewayCall[]> {
  const { callGateway } = await import("../gateway/call.js");
  return (callGateway as unknown as ReturnType<typeof vi.fn>).mock.calls.map(
    (call) => call[0] as GatewayCall,
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function findLastCall(calls: GatewayCall[], predicate: (call: GatewayCall) => boolean) {
  for (let i = calls.length - 1; i >= 0; i -= 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const call = calls[i];
    if (call && predicate(call)) {
      return call;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectThinkingPropagation(params: {
  callId: string;
  payload: Record<string, unknown>;
  expectedThinking: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createSessionsSpawnTool({ agentSessionKey: "agent:test:main" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await tool.execute(params.callId, params.payload);
  expect(result.details).toMatchObject({ status: "accepted" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const calls = await getGatewayCalls();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentCall = findLastCall(calls, (call) => call.method === "agent");
  const thinkingPatch = findLastCall(
    calls,
    (call) => call.method === "sessions.patch" && call.params?.thinkingLevel !== undefined,
  );

  expect(agentCall?.params?.thinking).toBe(params.expectedThinking);
  expect(thinkingPatch?.params?.thinkingLevel).toBe(params.expectedThinking);
}

describe("sessions_spawn thinking defaults", () => {
  it("applies agents.defaults.subagents.thinking when thinking is omitted", async () => {
    await expectThinkingPropagation({
      callId: "call-1",
      payload: { task: "hello" },
      expectedThinking: "high",
    });
  });

  it("prefers explicit sessions_spawn.thinking over config default", async () => {
    await expectThinkingPropagation({
      callId: "call-2",
      payload: { task: "hello", thinking: "low" },
      expectedThinking: "low",
    });
  });
});
