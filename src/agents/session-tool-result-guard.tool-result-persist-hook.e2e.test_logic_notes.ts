/*
 * AUTO ANNOTATION
 * File: src/agents/session-tool-result-guard.tool-result-persist-hook.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { SessionManager } from "@mariozechner/pi-coding-agent";
import { describe, expect, it, afterEach } from "vitest";
import {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
import { loadOpenClawPlugins } from "../plugins/loader.js";
import { guardSessionManager } from "./session-tool-result-guard-wrapper.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const EMPTY_PLUGIN_SCHEMA = { type: "object", additionalProperties: false, properties: {} };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function writeTempPlugin(params: { dir: string; id: string; body: string }): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pluginDir = path.join(params.dir, params.id);
  fs.mkdirSync(pluginDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const file = path.join(pluginDir, `${params.id}.mjs`);
  fs.writeFileSync(file, params.body, "utf-8");
  fs.writeFileSync(
    path.join(pluginDir, "openclaw.plugin.json"),
    JSON.stringify(
      {
        id: params.id,
        configSchema: EMPTY_PLUGIN_SCHEMA,
      },
      null,
      2,
    ),
    "utf-8",
  );
  return file;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function appendToolCallAndResult(sm: ReturnType<typeof SessionManager.inMemory>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const appendMessage = sm.appendMessage.bind(sm) as unknown as (message: AgentMessage) => void;
  appendMessage({
    role: "assistant",
    content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
  } as AgentMessage);

  appendMessage({
    role: "toolResult",
    toolCallId: "call_1",
    isError: false,
    content: [{ type: "text", text: "ok" }],
    details: { big: "x".repeat(10_000) },
    // oxlint-disable-next-line typescript/no-explicit-any
  } as any);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getPersistedToolResult(sm: ReturnType<typeof SessionManager.inMemory>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messages = sm
    .getEntries()
    .filter((e) => e.type === "message")
    .map((e) => (e as { message: AgentMessage }).message);

  // oxlint-disable-next-line typescript/no-explicit-any
  return messages.find((m) => (m as any).role === "toolResult") as any;
}

afterEach(() => {
  resetGlobalHookRunner();
});

describe("tool_result_persist hook", () => {
  it("does not modify persisted toolResult messages when no hook is registered", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sm = guardSessionManager(SessionManager.inMemory(), {
      agentId: "main",
      sessionKey: "main",
    });
    appendToolCallAndResult(sm);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolResult = getPersistedToolResult(sm);
    expect(toolResult).toBeTruthy();
    expect(toolResult.details).toBeTruthy();
  });

  it("loads tool_result_persist hooks without breaking persistence", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-toolpersist-"));
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";

    const pluginA = writeTempPlugin({
      dir: tmp,
      id: "persist-a",
      body: `export default { id: "persist-a", register(api) {
  api.on("tool_result_persist", (event, ctx) => {
    const msg = event.message;
    // Example: remove large diagnostic payloads before persistence.
    const { details: _details, ...rest } = msg;
    return { message: { ...rest, persistOrder: ["a"], agentSeen: ctx.agentId ?? null } };
  }, { priority: 10 });
} };`,
    });

    const pluginB = writeTempPlugin({
      dir: tmp,
      id: "persist-b",
      body: `export default { id: "persist-b", register(api) {
  api.on("tool_result_persist", (event) => {
    const prior = (event.message && event.message.persistOrder) ? event.message.persistOrder : [];
    return { message: { ...event.message, persistOrder: [...prior, "b"] } };
  }, { priority: 5 });
} };`,
    });

    const registry = loadOpenClawPlugins({
      cache: false,
      workspaceDir: tmp,
      config: {
        plugins: {
          load: { paths: [pluginA, pluginB] },
          allow: ["persist-a", "persist-b"],
        },
      },
    });
    initializeGlobalHookRunner(registry);

    const sm = guardSessionManager(SessionManager.inMemory(), {
      agentId: "main",
      sessionKey: "main",
    });

    appendToolCallAndResult(sm);
    const toolResult = getPersistedToolResult(sm);
    expect(toolResult).toBeTruthy();

    // Hook registration should not break baseline persistence semantics.
    expect(toolResult.details).toBeTruthy();
  });
});

describe("before_message_write hook", () => {
  it("continues persistence when a before_message_write hook throws", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-before-write-"));
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";

    const plugin = writeTempPlugin({
      dir: tmp,
      id: "before-write-throws",
      body: `export default { id: "before-write-throws", register(api) {
  api.on("before_message_write", () => {
    throw new Error("boom");
  }, { priority: 10 });
} };`,
    });

    const registry = loadOpenClawPlugins({
      cache: false,
      workspaceDir: tmp,
      config: {
        plugins: {
          load: { paths: [plugin] },
          allow: ["before-write-throws"],
        },
      },
    });
    initializeGlobalHookRunner(registry);

    const sm = guardSessionManager(SessionManager.inMemory(), {
      agentId: "main",
      sessionKey: "main",
    });
    const appendMessage = sm.appendMessage.bind(sm) as unknown as (message: AgentMessage) => void;
    appendMessage({
      role: "user",
      content: "hello",
      timestamp: Date.now(),
    } as AgentMessage);

    const messages = sm
      .getEntries()
      .filter((e) => e.type === "message")
      .map((e) => (e as { message: AgentMessage }).message);

    expect(messages).toHaveLength(1);
    expect(messages[0]?.role).toBe("user");
  });
});
