/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/provider.skill-dedupe.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { __testing } from "./provider.js";

describe("dedupeSkillCommandsForDiscord", () => {
  it("keeps first command per skillName and drops suffix duplicates", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = [
      { name: "github", skillName: "github", description: "GitHub" },
      { name: "github_2", skillName: "github", description: "GitHub" },
      { name: "weather", skillName: "weather", description: "Weather" },
      { name: "weather_2", skillName: "weather", description: "Weather" },
    ];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const output = __testing.dedupeSkillCommandsForDiscord(input);
    expect(output.map((entry) => entry.name)).toEqual(["github", "weather"]);
  });

  it("treats skillName case-insensitively", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = [
      { name: "ClawHub", skillName: "ClawHub", description: "ClawHub" },
      { name: "clawhub_2", skillName: "clawhub", description: "ClawHub" },
    ];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const output = __testing.dedupeSkillCommandsForDiscord(input);
    expect(output).toHaveLength(1);
    expect(output[0]?.name).toBe("ClawHub");
  });
});

describe("resolveThreadBindingsEnabled", () => {
  it("defaults to enabled when unset", () => {
    expect(
      __testing.resolveThreadBindingsEnabled({
        channelEnabledRaw: undefined,
        sessionEnabledRaw: undefined,
      }),
    ).toBe(true);
  });

  it("uses global session default when channel value is unset", () => {
    expect(
      __testing.resolveThreadBindingsEnabled({
        channelEnabledRaw: undefined,
        sessionEnabledRaw: false,
      }),
    ).toBe(false);
  });

  it("uses channel value to override global session default", () => {
    expect(
      __testing.resolveThreadBindingsEnabled({
        channelEnabledRaw: true,
        sessionEnabledRaw: false,
      }),
    ).toBe(true);
    expect(
      __testing.resolveThreadBindingsEnabled({
        channelEnabledRaw: false,
        sessionEnabledRaw: true,
      }),
    ).toBe(false);
  });
});
