/*
 * AUTO ANNOTATION
 * File: src/acp/translator.session-rate-limit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  AgentSideConnection,
  LoadSessionRequest,
  NewSessionRequest,
  PromptRequest,
} from "@agentclientprotocol/sdk";
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

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createGateway(
  request: GatewayClient["request"] = vi.fn(async () => ({ ok: true })) as GatewayClient["request"],
): GatewayClient {
  return {
    request,
  } as unknown as GatewayClient;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createNewSessionRequest(cwd = "/tmp"): NewSessionRequest {
  return {
    cwd,
    mcpServers: [],
    _meta: {},
  } as unknown as NewSessionRequest;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createLoadSessionRequest(sessionId: string, cwd = "/tmp"): LoadSessionRequest {
  return {
    sessionId,
    cwd,
    mcpServers: [],
    _meta: {},
  } as unknown as LoadSessionRequest;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPromptRequest(
  sessionId: string,
  text: string,
  meta: Record<string, unknown> = {},
): PromptRequest {
  return {
    sessionId,
    prompt: [{ type: "text", text }],
    _meta: meta,
  } as unknown as PromptRequest;
}

describe("acp session creation rate limit", () => {
  it("rate limits excessive newSession bursts", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionStore = createInMemorySessionStore();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = new AcpGatewayAgent(createConnection(), createGateway(), {
      sessionStore,
      sessionCreateRateLimit: {
        maxRequests: 2,
        windowMs: 60_000,
      },
    });

    await agent.newSession(createNewSessionRequest());
    await agent.newSession(createNewSessionRequest());
    await expect(agent.newSession(createNewSessionRequest())).rejects.toThrow(
      /session creation rate limit exceeded/i,
    );

    sessionStore.clearAllSessionsForTest();
  });

  it("does not count loadSession refreshes for an existing session ID", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionStore = createInMemorySessionStore();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = new AcpGatewayAgent(createConnection(), createGateway(), {
      sessionStore,
      sessionCreateRateLimit: {
        maxRequests: 1,
        windowMs: 60_000,
      },
    });

    await agent.loadSession(createLoadSessionRequest("shared-session"));
    await agent.loadSession(createLoadSessionRequest("shared-session"));
    await expect(agent.loadSession(createLoadSessionRequest("new-session"))).rejects.toThrow(
      /session creation rate limit exceeded/i,
    );

    sessionStore.clearAllSessionsForTest();
  });
});

describe("acp prompt size hardening", () => {
  it("rejects oversized prompt blocks without leaking active runs", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const request = vi.fn(async () => ({ ok: true })) as GatewayClient["request"];
    const sessionStore = createInMemorySessionStore();
    const agent = new AcpGatewayAgent(createConnection(), createGateway(request), {
      sessionStore,
    });
    const sessionId = "prompt-limit-oversize";
    await agent.loadSession(createLoadSessionRequest(sessionId));

    await expect(
      agent.prompt(createPromptRequest(sessionId, "a".repeat(2 * 1024 * 1024 + 1))),
    ).rejects.toThrow(/maximum allowed size/i);
    expect(request).not.toHaveBeenCalledWith("chat.send", expect.anything(), expect.anything());
    const session = sessionStore.getSession(sessionId);
    expect(session?.activeRunId).toBeNull();
    expect(session?.abortController).toBeNull();

    sessionStore.clearAllSessionsForTest();
  });

  it("rejects oversize final messages from cwd prefix without leaking active runs", async () => {
    const request = vi.fn(async () => ({ ok: true })) as GatewayClient["request"];
    const sessionStore = createInMemorySessionStore();
    const agent = new AcpGatewayAgent(createConnection(), createGateway(request), {
      sessionStore,
    });
    const sessionId = "prompt-limit-prefix";
    await agent.loadSession(createLoadSessionRequest(sessionId));

    await expect(
      agent.prompt(createPromptRequest(sessionId, "a".repeat(2 * 1024 * 1024))),
    ).rejects.toThrow(/maximum allowed size/i);
    expect(request).not.toHaveBeenCalledWith("chat.send", expect.anything(), expect.anything());
    const session = sessionStore.getSession(sessionId);
    expect(session?.activeRunId).toBeNull();
    expect(session?.abortController).toBeNull();

    sessionStore.clearAllSessionsForTest();
  });
});
