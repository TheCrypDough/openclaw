/*
 * AUTO ANNOTATION
 * File: src/agents/sessions-spawn-threadid.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it } from "vitest";
import "./test-helpers/fast-core-tools.js";
import {
  getCallGatewayMock,
  getSessionsSpawnTool,
  setSessionsSpawnConfigOverride,
} from "./openclaw-tools.subagents.sessions-spawn.test-harness.js";
import {
  listSubagentRunsForRequester,
  resetSubagentRegistryForTests,
} from "./subagent-registry.js";

describe("sessions_spawn requesterOrigin threading", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spawnAndReadRequesterRun = async (opts?: { agentThreadId?: number }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = await getSessionsSpawnTool({
      agentSessionKey: "main",
      agentChannel: "telegram",
      agentTo: "telegram:123",
      ...(opts?.agentThreadId === undefined ? {} : { agentThreadId: opts.agentThreadId }),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool.execute("call", {
      task: "do thing",
      runTimeoutSeconds: 1,
    });
    expect(result.details).toMatchObject({ status: "accepted", runId: "run-1" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runs = listSubagentRunsForRequester("main");
    expect(runs).toHaveLength(1);
    return runs[0];
  };

  beforeEach(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const callGatewayMock = getCallGatewayMock();
    resetSubagentRegistryForTests();
    callGatewayMock.mockReset();
    setSessionsSpawnConfigOverride({
      session: {
        mainKey: "main",
        scope: "per-sender",
      },
    });

    callGatewayMock.mockImplementation(async (opts: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const req = opts as { method?: string };
      if (req.method === "agent") {
        return { runId: "run-1", status: "accepted", acceptedAt: 1 };
      }
      // Prevent background announce flow by returning a non-terminal status.
      if (req.method === "agent.wait") {
        return { runId: "run-1", status: "running" };
      }
      return {};
    });
  });

  it("captures threadId in requesterOrigin", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = await spawnAndReadRequesterRun({ agentThreadId: 42 });
    expect(run?.requesterOrigin).toMatchObject({
      channel: "telegram",
      to: "telegram:123",
      threadId: 42,
    });
  });

  it("stores requesterOrigin without threadId when none is provided", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = await spawnAndReadRequesterRun();
    expect(run?.requesterOrigin?.threadId).toBeUndefined();
  });
});
