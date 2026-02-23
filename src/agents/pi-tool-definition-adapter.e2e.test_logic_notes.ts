/*
 * AUTO ANNOTATION
 * File: src/agents/pi-tool-definition-adapter.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentTool } from "@mariozechner/pi-agent-core";
import { Type } from "@sinclair/typebox";
import { describe, expect, it } from "vitest";
import { toToolDefinitions } from "./pi-tool-definition-adapter.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolExecute = ReturnType<typeof toToolDefinitions>[number]["execute"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const extensionContext = {} as Parameters<ToolExecute>[4];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function executeThrowingTool(name: string, callId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = {
    name,
    label: name === "bash" ? "Bash" : "Boom",
    description: "throws",
    parameters: Type.Object({}),
    execute: async () => {
      throw new Error("nope");
    },
  } satisfies AgentTool;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defs = toToolDefinitions([tool]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const def = defs[0];
  if (!def) {
    throw new Error("missing tool definition");
  }
  return await def.execute(callId, {}, undefined, undefined, extensionContext);
}

describe("pi tool definition adapter", () => {
  it("wraps tool errors into a tool result", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await executeThrowingTool("boom", "call1");

    expect(result.details).toMatchObject({
      status: "error",
      tool: "boom",
    });
    expect(result.details).toMatchObject({ error: "nope" });
    expect(JSON.stringify(result.details)).not.toContain("\n    at ");
  });

  it("normalizes exec tool aliases in error results", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await executeThrowingTool("bash", "call2");

    expect(result.details).toMatchObject({
      status: "error",
      tool: "exec",
      error: "nope",
    });
  });
});
