/*
 * AUTO ANNOTATION
 * File: src/infra/process-respawn.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { captureFullEnv } from "../test-utils/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const spawnMock = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({
  spawn: (...args: unknown[]) => spawnMock(...args),
}));

import { restartGatewayProcessWithFreshPid } from "./process-respawn.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const originalArgv = [...process.argv];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const originalExecArgv = [...process.execArgv];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const envSnapshot = captureFullEnv();

afterEach(() => {
  envSnapshot.restore();
  process.argv = [...originalArgv];
  process.execArgv = [...originalExecArgv];
  spawnMock.mockReset();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function clearSupervisorHints() {
  delete process.env.LAUNCH_JOB_LABEL;
  delete process.env.LAUNCH_JOB_NAME;
  delete process.env.INVOCATION_ID;
  delete process.env.SYSTEMD_EXEC_PID;
  delete process.env.JOURNAL_STREAM;
}

describe("restartGatewayProcessWithFreshPid", () => {
  it("returns disabled when OPENCLAW_NO_RESPAWN is set", () => {
    process.env.OPENCLAW_NO_RESPAWN = "1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = restartGatewayProcessWithFreshPid();
    expect(result.mode).toBe("disabled");
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it("returns supervised when launchd/systemd hints are present", () => {
    process.env.LAUNCH_JOB_LABEL = "ai.openclaw.gateway";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = restartGatewayProcessWithFreshPid();
    expect(result.mode).toBe("supervised");
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it("spawns detached child with current exec argv", () => {
    delete process.env.OPENCLAW_NO_RESPAWN;
    clearSupervisorHints();
    process.execArgv = ["--import", "tsx"];
    process.argv = ["/usr/local/bin/node", "/repo/dist/index.js", "gateway", "run"];
    spawnMock.mockReturnValue({ pid: 4242, unref: vi.fn() });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = restartGatewayProcessWithFreshPid();

    expect(result).toEqual({ mode: "spawned", pid: 4242 });
    expect(spawnMock).toHaveBeenCalledWith(
      process.execPath,
      ["--import", "tsx", "/repo/dist/index.js", "gateway", "run"],
      expect.objectContaining({
        detached: true,
        stdio: "inherit",
      }),
    );
  });

  it("returns failed when spawn throws", () => {
    delete process.env.OPENCLAW_NO_RESPAWN;
    clearSupervisorHints();

    spawnMock.mockImplementation(() => {
      throw new Error("spawn failed");
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = restartGatewayProcessWithFreshPid();
    expect(result.mode).toBe("failed");
    expect(result.detail).toContain("spawn failed");
  });
});
