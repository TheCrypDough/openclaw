/*
 * AUTO ANNOTATION
 * File: src/commands/doctor.migrates-slack-discord-dm-policy-aliases.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { readConfigFileSnapshot, writeConfigFile } from "./doctor.e2e-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DOCTOR_MIGRATION_TIMEOUT_MS = 20_000;

describe("doctor command", () => {
  it(
    "migrates Slack/Discord dm.policy keys to dmPolicy aliases",
    { timeout: DOCTOR_MIGRATION_TIMEOUT_MS },
    async () => {
      readConfigFileSnapshot.mockResolvedValue({
        path: "/tmp/openclaw.json",
        exists: true,
        raw: "{}",
        parsed: {
          channels: {
            slack: { dm: { enabled: true, policy: "open", allowFrom: ["*"] } },
            discord: {
              dm: { enabled: true, policy: "allowlist", allowFrom: ["123"] },
            },
          },
        },
        valid: true,
        config: {
          channels: {
            slack: { dm: { enabled: true, policy: "open", allowFrom: ["*"] } },
            discord: { dm: { enabled: true, policy: "allowlist", allowFrom: ["123"] } },
          },
        },
        issues: [],
        legacyIssues: [],
      });

      const { doctorCommand } = await import("./doctor.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const runtime = { log: vi.fn(), error: vi.fn(), exit: vi.fn() };

      await doctorCommand(runtime, { nonInteractive: true, repair: true });

      expect(writeConfigFile).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const written = writeConfigFile.mock.calls[0]?.[0] as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channels = (written.channels ?? {}) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const slack = (channels.slack ?? {}) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const discord = (channels.discord ?? {}) as Record<string, unknown>;

      expect(slack.dmPolicy).toBe("open");
      expect(slack.allowFrom).toEqual(["*"]);
      expect(slack.dm).toEqual({ enabled: true });

      expect(discord.dmPolicy).toBe("allowlist");
      expect(discord.allowFrom).toEqual(["123"]);
      expect(discord.dm).toEqual({ enabled: true });
    },
  );
});
