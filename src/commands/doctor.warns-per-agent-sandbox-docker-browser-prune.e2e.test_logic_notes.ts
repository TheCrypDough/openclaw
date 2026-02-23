/*
 * AUTO ANNOTATION
 * File: src/commands/doctor.warns-per-agent-sandbox-docker-browser-prune.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createDoctorRuntime, mockDoctorConfigSnapshot, note } from "./doctor.e2e-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let doctorCommand: typeof import("./doctor.js").doctorCommand;

describe("doctor command", () => {
  beforeAll(async () => {
    ({ doctorCommand } = await import("./doctor.js"));
  });

  it("warns when per-agent sandbox docker/browser/prune overrides are ignored under shared scope", async () => {
    mockDoctorConfigSnapshot({
      config: {
        agents: {
          defaults: {
            sandbox: {
              mode: "all",
              scope: "shared",
            },
          },
          list: [
            {
              id: "work",
              workspace: "~/openclaw-work",
              sandbox: {
                mode: "all",
                scope: "shared",
                docker: {
                  setupCommand: "echo work",
                },
              },
            },
          ],
        },
      },
    });

    note.mockClear();

    await doctorCommand(createDoctorRuntime(), { nonInteractive: true });

    expect(
      note.mock.calls.some(([message, title]) => {
        if (title !== "Sandbox" || typeof message !== "string") {
          return false;
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const normalized = message.replace(/\s+/g, " ").trim();
        return (
          normalized.includes('agents.list (id "work") sandbox docker') &&
          normalized.includes('scope resolves to "shared"')
        );
      }),
    ).toBe(true);
  }, 30_000);

  it("does not warn when only the active workspace is present", async () => {
    mockDoctorConfigSnapshot({
      config: {
        agents: { defaults: { workspace: "/Users/steipete/openclaw" } },
      },
    });

    note.mockClear();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const homedirSpy = vi.spyOn(os, "homedir").mockReturnValue("/Users/steipete");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const realExists = fs.existsSync;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const legacyPath = path.join("/Users/steipete", "openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const legacyAgentsPath = path.join(legacyPath, "AGENTS.md");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existsSpy = vi.spyOn(fs, "existsSync").mockImplementation((value) => {
      if (
        value === "/Users/steipete/openclaw" ||
        value === legacyPath ||
        value === legacyAgentsPath
      ) {
        return true;
      }
      return realExists(value as never);
    });

    await doctorCommand(createDoctorRuntime(), { nonInteractive: true });

    expect(note.mock.calls.some(([_, title]) => title === "Extra workspace")).toBe(false);

    homedirSpy.mockRestore();
    existsSpy.mockRestore();
  });
});
