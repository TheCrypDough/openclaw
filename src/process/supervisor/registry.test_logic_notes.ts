/*
 * AUTO ANNOTATION
 * File: src/process/supervisor/registry.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createRunRegistry } from "./registry.js";

describe("process supervisor run registry", () => {
  it("finalize is idempotent and preserves first terminal metadata", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createRunRegistry();
    registry.add({
      runId: "r1",
      sessionId: "s1",
      backendId: "b1",
      state: "running",
      startedAtMs: 1,
      lastOutputAtMs: 1,
      createdAtMs: 1,
      updatedAtMs: 1,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = registry.finalize("r1", {
      reason: "overall-timeout",
      exitCode: null,
      exitSignal: "SIGKILL",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = registry.finalize("r1", {
      reason: "manual-cancel",
      exitCode: 0,
      exitSignal: null,
    });

    expect(first).not.toBeNull();
    expect(first?.firstFinalize).toBe(true);
    expect(first?.record.terminationReason).toBe("overall-timeout");
    expect(first?.record.exitCode).toBeNull();
    expect(first?.record.exitSignal).toBe("SIGKILL");

    expect(second).not.toBeNull();
    expect(second?.firstFinalize).toBe(false);
    expect(second?.record.terminationReason).toBe("overall-timeout");
    expect(second?.record.exitCode).toBeNull();
    expect(second?.record.exitSignal).toBe("SIGKILL");
  });

  it("prunes oldest exited records once retention cap is exceeded", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createRunRegistry({ maxExitedRecords: 2 });
    registry.add({
      runId: "r1",
      sessionId: "s1",
      backendId: "b1",
      state: "running",
      startedAtMs: 1,
      lastOutputAtMs: 1,
      createdAtMs: 1,
      updatedAtMs: 1,
    });
    registry.add({
      runId: "r2",
      sessionId: "s2",
      backendId: "b1",
      state: "running",
      startedAtMs: 2,
      lastOutputAtMs: 2,
      createdAtMs: 2,
      updatedAtMs: 2,
    });
    registry.add({
      runId: "r3",
      sessionId: "s3",
      backendId: "b1",
      state: "running",
      startedAtMs: 3,
      lastOutputAtMs: 3,
      createdAtMs: 3,
      updatedAtMs: 3,
    });

    registry.finalize("r1", { reason: "exit", exitCode: 0, exitSignal: null });
    registry.finalize("r2", { reason: "exit", exitCode: 0, exitSignal: null });
    registry.finalize("r3", { reason: "exit", exitCode: 0, exitSignal: null });

    expect(registry.get("r1")).toBeUndefined();
    expect(registry.get("r2")?.state).toBe("exited");
    expect(registry.get("r3")?.state).toBe("exited");
  });
});
