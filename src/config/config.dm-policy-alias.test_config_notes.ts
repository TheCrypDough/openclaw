# AUTOPLACEHOLDER_ANNOTATION: src/config/config.dm-policy-alias.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("DM policy aliases (Slack/Discord)", () => {
  it('rejects discord dmPolicy="open" without allowFrom "*"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: { discord: { dmPolicy: "open", allowFrom: ["123"] } },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("channels.discord.allowFrom");
    }
  });

  it('accepts discord legacy dm.policy="open" with top-level allowFrom alias', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: { discord: { dm: { policy: "open", allowFrom: ["123"] }, allowFrom: ["*"] } },
    });
    expect(res.ok).toBe(true);
  });

  it('rejects slack dmPolicy="open" without allowFrom "*"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: { slack: { dmPolicy: "open", allowFrom: ["U123"] } },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues[0]?.path).toBe("channels.slack.allowFrom");
    }
  });

  it('accepts slack legacy dm.policy="open" with top-level allowFrom alias', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: { slack: { dm: { policy: "open", allowFrom: ["U123"] }, allowFrom: ["*"] } },
    });
    expect(res.ok).toBe(true);
  });
});
