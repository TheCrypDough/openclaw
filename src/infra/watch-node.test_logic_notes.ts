/*
 * AUTO ANNOTATION
 * File: src/infra/watch-node.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";
import { runNodeWatchedPaths } from "../../scripts/run-node.mjs";
import { runWatchMain } from "../../scripts/watch-node.mjs";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createFakeProcess = () =>
  Object.assign(new EventEmitter(), {
    pid: 4242,
    execPath: "/usr/local/bin/node",
  }) as unknown as NodeJS.Process;

describe("watch-node script", () => {
  it("wires node watch to run-node with watched source/config paths", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const child = Object.assign(new EventEmitter(), {
      kill: vi.fn(),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawn = vi.fn(() => child);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fakeProcess = createFakeProcess();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runPromise = runWatchMain({
      args: ["gateway", "--force"],
      cwd: "/tmp/openclaw",
      env: { PATH: "/usr/bin" },
      now: () => 1700000000000,
      process: fakeProcess,
      spawn,
    });

    queueMicrotask(() => child.emit("exit", 0, null));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exitCode = await runPromise;

    expect(exitCode).toBe(0);
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith(
      "/usr/local/bin/node",
      [
        ...runNodeWatchedPaths.flatMap((watchPath) => ["--watch-path", watchPath]),
        "--watch-preserve-output",
        "scripts/run-node.mjs",
        "gateway",
        "--force",
      ],
      expect.objectContaining({
        cwd: "/tmp/openclaw",
        stdio: "inherit",
        env: expect.objectContaining({
          PATH: "/usr/bin",
          OPENCLAW_WATCH_MODE: "1",
          OPENCLAW_WATCH_SESSION: "1700000000000-4242",
          OPENCLAW_WATCH_COMMAND: "gateway --force",
        }),
      }),
    );
  });

  it("terminates child on SIGINT and returns shell interrupt code", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const child = Object.assign(new EventEmitter(), {
      kill: vi.fn(),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawn = vi.fn(() => child);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fakeProcess = createFakeProcess();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runPromise = runWatchMain({
      args: ["gateway", "--force"],
      process: fakeProcess,
      spawn,
    });

    fakeProcess.emit("SIGINT");
    const exitCode = await runPromise;

    expect(exitCode).toBe(130);
    expect(child.kill).toHaveBeenCalledWith("SIGTERM");
    expect(fakeProcess.listenerCount("SIGINT")).toBe(0);
    expect(fakeProcess.listenerCount("SIGTERM")).toBe(0);
  });
});
