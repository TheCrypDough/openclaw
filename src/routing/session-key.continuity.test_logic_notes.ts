/*
 * AUTO ANNOTATION
 * File: src/routing/session-key.continuity.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, it, expect } from "vitest";
import { buildAgentSessionKey } from "./resolve-route.js";

describe("Discord Session Key Continuity", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId = "main";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channel = "discord";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = "default";

  it("generates distinct keys for DM vs Channel (dmScope=main)", () => {
    // Scenario: Default config (dmScope=main)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dmKey = buildAgentSessionKey({
      agentId,
      channel,
      accountId,
      peer: { kind: "direct", id: "user123" },
      dmScope: "main",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const groupKey = buildAgentSessionKey({
      agentId,
      channel,
      accountId,
      peer: { kind: "channel", id: "channel456" },
      dmScope: "main",
    });

    expect(dmKey).toBe("agent:main:main");
    expect(groupKey).toBe("agent:main:discord:channel:channel456");
    expect(dmKey).not.toBe(groupKey);
  });

  it("generates distinct keys for DM vs Channel (dmScope=per-peer)", () => {
    // Scenario: Multi-user bot config
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dmKey = buildAgentSessionKey({
      agentId,
      channel,
      accountId,
      peer: { kind: "direct", id: "user123" },
      dmScope: "per-peer",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const groupKey = buildAgentSessionKey({
      agentId,
      channel,
      accountId,
      peer: { kind: "channel", id: "channel456" },
      dmScope: "per-peer",
    });

    expect(dmKey).toBe("agent:main:direct:user123");
    expect(groupKey).toBe("agent:main:discord:channel:channel456");
    expect(dmKey).not.toBe(groupKey);
  });

  it("handles empty/invalid IDs safely without collision", () => {
    // If ID is missing, does it collide?
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const missingIdKey = buildAgentSessionKey({
      agentId,
      channel,
      accountId,
      peer: { kind: "channel", id: "" }, // Empty string
      dmScope: "main",
    });

    expect(missingIdKey).toContain("unknown");

    // Should still be distinct from main
    expect(missingIdKey).not.toBe("agent:main:main");
  });
});
