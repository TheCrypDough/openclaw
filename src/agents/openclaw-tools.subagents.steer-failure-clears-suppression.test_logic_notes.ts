/*
 * AUTO ANNOTATION
 * File: src/agents/openclaw-tools.subagents.steer-failure-clears-suppression.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  callGatewayMock,
  setSubagentsConfigOverride,
} from "./openclaw-tools.subagents.test-harness.js";
import {
  addSubagentRunForTests,
  listSubagentRunsForRequester,
  resetSubagentRegistryForTests,
} from "./subagent-registry.js";
import "./test-helpers/fast-core-tools.js";
import { createSubagentsTool } from "./tools/subagents-tool.js";

describe("openclaw-tools: subagents steer failure", () => {
  beforeEach(() => {
    resetSubagentRegistryForTests();
    callGatewayMock.mockReset();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const storePath = path.join(
      os.tmpdir(),
      `openclaw-subagents-steer-${Date.now()}-${Math.random().toString(16).slice(2)}.json`,
    );
    setSubagentsConfigOverride({
      session: {
        mainKey: "main",
        scope: "per-sender",
        store: storePath,
      },
    });
    fs.writeFileSync(storePath, "{}", "utf-8");
  });

  it("restores announce behavior when steer replacement dispatch fails", async () => {
    addSubagentRunForTests({
      runId: "run-old",
      childSessionKey: "agent:main:subagent:worker",
      requesterSessionKey: "agent:main:main",
      requesterDisplayKey: "main",
      task: "do work",
      cleanup: "keep",
      createdAt: Date.now(),
      startedAt: Date.now(),
    });

    callGatewayMock.mockImplementation(async (opts: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const request = opts as { method?: string };
      if (request.method === "agent.wait") {
        return { status: "timeout" };
      }
      if (request.method === "agent") {
        throw new Error("dispatch failed");
      }
      return {};
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = createSubagentsTool({
      agentSessionKey: "agent:main:main",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await tool.execute("call-steer", {
      action: "steer",
      target: "1",
      message: "new direction",
    });

    expect(result.details).toMatchObject({
      status: "error",
      action: "steer",
      runId: expect.any(String),
      error: "dispatch failed",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runs = listSubagentRunsForRequester("agent:main:main");
    expect(runs).toHaveLength(1);
    expect(runs[0].runId).toBe("run-old");
    expect(runs[0].suppressAnnounceReason).toBeUndefined();
  });
});
