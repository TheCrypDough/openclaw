# AUTOPLACEHOLDER_ANNOTATION: src/cli/program/config-guard.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const loadAndMaybeMigrateDoctorConfigMock = vi.hoisted(() => vi.fn());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readConfigFileSnapshotMock = vi.hoisted(() => vi.fn());

vi.mock("../../commands/doctor-config-flow.js", () => ({
  loadAndMaybeMigrateDoctorConfig: loadAndMaybeMigrateDoctorConfigMock,
}));

vi.mock("../../config/config.js", () => ({
  readConfigFileSnapshot: readConfigFileSnapshotMock,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeSnapshot() {
  return {
    exists: false,
    valid: true,
    issues: [],
    legacyIssues: [],
    path: "/tmp/openclaw.json",
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeRuntime() {
  return {
    error: vi.fn(),
    exit: vi.fn(),
  };
}

describe("ensureConfigReady", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function loadEnsureConfigReady() {
    vi.resetModules();
    return await import("./config-guard.js");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runEnsureConfigReady(commandPath: string[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = makeRuntime();
    const { ensureConfigReady } = await loadEnsureConfigReady();
    await ensureConfigReady({ runtime: runtime as never, commandPath });
    return runtime;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function setInvalidSnapshot(overrides?: Partial<ReturnType<typeof makeSnapshot>>) {
    readConfigFileSnapshotMock.mockResolvedValue({
      ...makeSnapshot(),
      exists: true,
      valid: false,
      issues: [{ path: "channels.whatsapp", message: "invalid" }],
      ...overrides,
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    readConfigFileSnapshotMock.mockResolvedValue(makeSnapshot());
  });

  it.each([
    {
      name: "skips doctor flow for read-only fast path commands",
      commandPath: ["status"],
      expectedDoctorCalls: 0,
    },
    {
      name: "runs doctor flow for commands that may mutate state",
      commandPath: ["message"],
      expectedDoctorCalls: 1,
    },
  ])("$name", async ({ commandPath, expectedDoctorCalls }) => {
    await runEnsureConfigReady(commandPath);
    expect(loadAndMaybeMigrateDoctorConfigMock).toHaveBeenCalledTimes(expectedDoctorCalls);
  });

  it("exits for invalid config on non-allowlisted commands", async () => {
    setInvalidSnapshot();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = await runEnsureConfigReady(["message"]);

    expect(runtime.error).toHaveBeenCalledWith(expect.stringContaining("Config invalid"));
    expect(runtime.error).toHaveBeenCalledWith(expect.stringContaining("doctor --fix"));
    expect(runtime.exit).toHaveBeenCalledWith(1);
  });

  it("does not exit for invalid config on allowlisted commands", async () => {
    setInvalidSnapshot();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const statusRuntime = await runEnsureConfigReady(["status"]);
    expect(statusRuntime.exit).not.toHaveBeenCalled();

    const gatewayRuntime = await runEnsureConfigReady(["gateway", "health"]);
    expect(gatewayRuntime.exit).not.toHaveBeenCalled();
  });

  it("runs doctor migration flow only once per module instance", async () => {
    const runtimeA = makeRuntime();
    const runtimeB = makeRuntime();
    const { ensureConfigReady } = await loadEnsureConfigReady();

    await ensureConfigReady({ runtime: runtimeA as never, commandPath: ["message"] });
    await ensureConfigReady({ runtime: runtimeB as never, commandPath: ["message"] });

    expect(loadAndMaybeMigrateDoctorConfigMock).toHaveBeenCalledTimes(1);
  });
});
