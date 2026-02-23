/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.createsystempromptoverride.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createSystemPromptOverride } from "./pi-embedded-runner.js";

describe("createSystemPromptOverride", () => {
  it("returns the override prompt trimmed", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const override = createSystemPromptOverride("OVERRIDE");
    expect(override()).toBe("OVERRIDE");
  });

  it("returns an empty string for blank overrides", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const override = createSystemPromptOverride("  \n  ");
    expect(override()).toBe("");
  });
});
