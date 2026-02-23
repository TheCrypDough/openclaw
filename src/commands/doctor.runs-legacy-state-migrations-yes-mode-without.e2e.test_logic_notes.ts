/*
 * AUTO ANNOTATION
 * File: src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  arrangeLegacyStateMigrationTest,
  confirm,
  createDoctorRuntime,
  ensureAuthProfileStore,
  mockDoctorConfigSnapshot,
  serviceIsLoaded,
  serviceRestart,
  writeConfigFile,
} from "./doctor.e2e-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let doctorCommand: typeof import("./doctor.js").doctorCommand;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let healthCommand: typeof import("./health.js").healthCommand;

describe("doctor command", () => {
  beforeAll(async () => {
    ({ doctorCommand } = await import("./doctor.js"));
    ({ healthCommand } = await import("./health.js"));
  });

  it("runs legacy state migrations in yes mode without prompting", async () => {
    const { doctorCommand, runtime, runLegacyStateMigrations } =
      await arrangeLegacyStateMigrationTest();

    await (doctorCommand as (runtime: unknown, opts: Record<string, unknown>) => Promise<void>)(
      runtime,
      { yes: true },
    );

    expect(runLegacyStateMigrations).toHaveBeenCalledTimes(1);
    expect(confirm).not.toHaveBeenCalled();
  }, 30_000);

  it("runs legacy state migrations in non-interactive mode without prompting", async () => {
    const { doctorCommand, runtime, runLegacyStateMigrations } =
      await arrangeLegacyStateMigrationTest();

    await (doctorCommand as (runtime: unknown, opts: Record<string, unknown>) => Promise<void>)(
      runtime,
      { nonInteractive: true },
    );

    expect(runLegacyStateMigrations).toHaveBeenCalledTimes(1);
    expect(confirm).not.toHaveBeenCalled();
  }, 30_000);

  it("skips gateway restarts in non-interactive mode", async () => {
    mockDoctorConfigSnapshot();

    vi.mocked(healthCommand).mockRejectedValueOnce(new Error("gateway closed"));

    serviceIsLoaded.mockResolvedValueOnce(true);
    serviceRestart.mockClear();
    confirm.mockClear();

    await doctorCommand(createDoctorRuntime(), { nonInteractive: true });

    expect(serviceRestart).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  it("migrates anthropic oauth config profile id when only email profile exists", async () => {
    mockDoctorConfigSnapshot({
      config: {
        auth: {
          profiles: {
            "anthropic:default": { provider: "anthropic", mode: "oauth" },
          },
        },
      },
    });

    ensureAuthProfileStore.mockReturnValueOnce({
      version: 1,
      profiles: {
        "anthropic:me@example.com": {
          type: "oauth",
          provider: "anthropic",
          access: "access",
          refresh: "refresh",
          expires: Date.now() + 60_000,
          email: "me@example.com",
        },
      },
    });

    await doctorCommand(createDoctorRuntime(), { yes: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const written = writeConfigFile.mock.calls.at(-1)?.[0] as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profiles = (written.auth as { profiles: Record<string, unknown> }).profiles;
    expect(profiles["anthropic:me@example.com"]).toBeTruthy();
    expect(profiles["anthropic:default"]).toBeUndefined();
  }, 30_000);
});
