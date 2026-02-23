/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/commands.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveDiscordSlashCommandConfig } from "./commands.js";

describe("resolveDiscordSlashCommandConfig", () => {
  it("defaults ephemeral to true when undefined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveDiscordSlashCommandConfig(undefined);
    expect(result.ephemeral).toBe(true);
  });

  it("defaults ephemeral to true when not explicitly false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveDiscordSlashCommandConfig({});
    expect(result.ephemeral).toBe(true);
  });

  it("sets ephemeral to false when explicitly false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveDiscordSlashCommandConfig({ ephemeral: false });
    expect(result.ephemeral).toBe(false);
  });

  it("keeps ephemeral true when explicitly true", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveDiscordSlashCommandConfig({ ephemeral: true });
    expect(result.ephemeral).toBe(true);
  });
});
