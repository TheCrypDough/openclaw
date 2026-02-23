/*
 * AUTO ANNOTATION
 * File: src/acp/translator.prompt-prefix.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import os from "node:os";
import path from "node:path";
import type { AgentSideConnection, PromptRequest } from "@agentclientprotocol/sdk";
import { describe, expect, it, vi } from "vitest";
import type { GatewayClient } from "../gateway/client.js";
import { createInMemorySessionStore } from "./session.js";
import { AcpGatewayAgent } from "./translator.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createConnection(): AgentSideConnection {
  return {
    sessionUpdate: vi.fn(async () => {}),
  } as unknown as AgentSideConnection;
}

describe("acp prompt cwd prefix", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runPromptWithCwd(cwd: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionStore = createInMemorySessionStore();
    sessionStore.createSession({
      sessionId: "session-1",
      sessionKey: "agent:main:main",
      cwd,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const requestSpy = vi.fn(async (method: string) => {
      if (method === "chat.send") {
        throw new Error("stop-after-send");
      }
      return {};
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gateway = {
      request: requestSpy,
    } as unknown as GatewayClient;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = new AcpGatewayAgent(createConnection(), gateway, {
      sessionStore,
      prefixCwd: true,
    });

    await expect(
      agent.prompt({
        sessionId: "session-1",
        prompt: [{ type: "text", text: "hello" }],
        _meta: {},
      } as unknown as PromptRequest),
    ).rejects.toThrow("stop-after-send");
    return requestSpy;
  }

  it("redacts home directory in prompt prefix", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const requestSpy = await runPromptWithCwd(path.join(os.homedir(), "openclaw-test"));
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        message: expect.stringMatching(/\[Working directory: ~[\\/]openclaw-test\]/),
      }),
      { expectFinal: true },
    );
  });

  it("keeps backslash separators when cwd uses them", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const requestSpy = await runPromptWithCwd(`${os.homedir()}\\openclaw-test`);
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        message: expect.stringContaining("[Working directory: ~\\openclaw-test]"),
      }),
      { expectFinal: true },
    );
  });
});
