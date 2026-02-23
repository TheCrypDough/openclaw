/*
 * AUTO ANNOTATION
 * File: src/agents/pi-tools.whatsapp-login-gating.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import "./test-helpers/fast-coding-tools.js";
import { createOpenClawCodingTools } from "./pi-tools.js";

vi.mock("./channel-tools.js", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stubTool = (name: string) => ({
    name,
    description: `${name} stub`,
    parameters: { type: "object", properties: {} },
    execute: vi.fn(),
  });
  return {
    listChannelAgentTools: () => [stubTool("whatsapp_login")],
  };
});

describe("owner-only tool gating", () => {
  it("removes owner-only tools for unauthorized senders", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = createOpenClawCodingTools({ senderIsOwner: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolNames = tools.map((tool) => tool.name);
    expect(toolNames).not.toContain("whatsapp_login");
    expect(toolNames).not.toContain("cron");
    expect(toolNames).not.toContain("gateway");
  });

  it("keeps owner-only tools for authorized senders", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = createOpenClawCodingTools({ senderIsOwner: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolNames = tools.map((tool) => tool.name);
    expect(toolNames).toContain("whatsapp_login");
    expect(toolNames).toContain("cron");
    expect(toolNames).toContain("gateway");
  });

  it("defaults to removing owner-only tools when owner status is unknown", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = createOpenClawCodingTools();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const toolNames = tools.map((tool) => tool.name);
    expect(toolNames).not.toContain("whatsapp_login");
    expect(toolNames).not.toContain("cron");
    expect(toolNames).not.toContain("gateway");
  });
});
