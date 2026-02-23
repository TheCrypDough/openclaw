/*
 * AUTO ANNOTATION
 * File: src/process/supervisor/supervisor.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createProcessSupervisor } from "./supervisor.js";

describe("process supervisor", () => {
  it("spawns child runs and captures output", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const supervisor = createProcessSupervisor();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = await supervisor.spawn({
      sessionId: "s1",
      backendId: "test",
      mode: "child",
      argv: [process.execPath, "-e", 'process.stdout.write("ok")'],
      timeoutMs: 2_500,
      stdinMode: "pipe-closed",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exit = await run.wait();
    expect(exit.reason).toBe("exit");
    expect(exit.exitCode).toBe(0);
    expect(exit.stdout).toBe("ok");
  });

  it("enforces no-output timeout for silent processes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const supervisor = createProcessSupervisor();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = await supervisor.spawn({
      sessionId: "s1",
      backendId: "test",
      mode: "child",
      argv: [process.execPath, "-e", "setTimeout(() => {}, 120)"],
      timeoutMs: 1_000,
      noOutputTimeoutMs: 20,
      stdinMode: "pipe-closed",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exit = await run.wait();
    expect(exit.reason).toBe("no-output-timeout");
    expect(exit.noOutputTimedOut).toBe(true);
    expect(exit.timedOut).toBe(true);
  });

  it("cancels prior scoped run when replaceExistingScope is enabled", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const supervisor = createProcessSupervisor();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = await supervisor.spawn({
      sessionId: "s1",
      backendId: "test",
      scopeKey: "scope:a",
      mode: "child",
      argv: [process.execPath, "-e", "setTimeout(() => {}, 120)"],
      timeoutMs: 1_000,
      stdinMode: "pipe-open",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = await supervisor.spawn({
      sessionId: "s1",
      backendId: "test",
      scopeKey: "scope:a",
      replaceExistingScope: true,
      mode: "child",
      argv: [process.execPath, "-e", 'process.stdout.write("new")'],
      timeoutMs: 2_500,
      stdinMode: "pipe-closed",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const firstExit = await first.wait();
    const secondExit = await second.wait();
    expect(firstExit.reason === "manual-cancel" || firstExit.reason === "signal").toBe(true);
    expect(secondExit.reason).toBe("exit");
    expect(secondExit.stdout).toBe("new");
  });

  it("applies overall timeout even for near-immediate timer firing", async () => {
    const supervisor = createProcessSupervisor();
    const run = await supervisor.spawn({
      sessionId: "s-timeout",
      backendId: "test",
      mode: "child",
      argv: [process.execPath, "-e", "setTimeout(() => {}, 120)"],
      timeoutMs: 1,
      stdinMode: "pipe-closed",
    });
    const exit = await run.wait();
    expect(exit.reason).toBe("overall-timeout");
    expect(exit.timedOut).toBe(true);
  });

  it("can stream output without retaining it in RunExit payload", async () => {
    const supervisor = createProcessSupervisor();
    let streamed = "";
    const run = await supervisor.spawn({
      sessionId: "s-capture",
      backendId: "test",
      mode: "child",
      argv: [process.execPath, "-e", 'process.stdout.write("streamed")'],
      timeoutMs: 2_500,
      stdinMode: "pipe-closed",
      captureOutput: false,
      onStdout: (chunk) => {
        streamed += chunk;
      },
    });
    const exit = await run.wait();
    expect(streamed).toBe("streamed");
    expect(exit.stdout).toBe("");
  });
});
