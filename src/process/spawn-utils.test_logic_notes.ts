/*
 * AUTO ANNOTATION
 * File: src/process/spawn-utils.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { createRestartIterationHook } from "./restart-recovery.js";
import { spawnWithFallback } from "./spawn-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createStubChild() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const child = new EventEmitter() as ChildProcess;
  child.stdin = new PassThrough() as ChildProcess["stdin"];
  child.stdout = new PassThrough() as ChildProcess["stdout"];
  child.stderr = new PassThrough() as ChildProcess["stderr"];
  Object.defineProperty(child, "pid", { value: 1234, configurable: true });
  Object.defineProperty(child, "killed", { value: false, configurable: true, writable: true });
  child.kill = vi.fn(() => true) as ChildProcess["kill"];
  queueMicrotask(() => {
    child.emit("spawn");
  });
  return child;
}

describe("spawnWithFallback", () => {
  it("retries on EBADF using fallback options", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawnMock = vi
      .fn()
      .mockImplementationOnce(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const err = new Error("spawn EBADF");
        (err as NodeJS.ErrnoException).code = "EBADF";
        throw err;
      })
      .mockImplementationOnce(() => createStubChild());

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await spawnWithFallback({
      argv: ["echo", "ok"],
      options: { stdio: ["pipe", "pipe", "pipe"] },
      fallbacks: [{ label: "safe-stdin", options: { stdio: ["ignore", "pipe", "pipe"] } }],
      spawnImpl: spawnMock,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.fallbackLabel).toBe("safe-stdin");
    expect(spawnMock).toHaveBeenCalledTimes(2);
    expect(spawnMock.mock.calls[0]?.[2]?.stdio).toEqual(["pipe", "pipe", "pipe"]);
    expect(spawnMock.mock.calls[1]?.[2]?.stdio).toEqual(["ignore", "pipe", "pipe"]);
  });

  it("does not retry on non-EBADF errors", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawnMock = vi.fn().mockImplementationOnce(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const err = new Error("spawn ENOENT");
      (err as NodeJS.ErrnoException).code = "ENOENT";
      throw err;
    });

    await expect(
      spawnWithFallback({
        argv: ["missing"],
        options: { stdio: ["pipe", "pipe", "pipe"] },
        fallbacks: [{ label: "safe-stdin", options: { stdio: ["ignore", "pipe", "pipe"] } }],
        spawnImpl: spawnMock,
      }),
    ).rejects.toThrow(/ENOENT/);
    expect(spawnMock).toHaveBeenCalledTimes(1);
  });
});

describe("restart-recovery", () => {
  it("skips recovery on first iteration and runs on subsequent iterations", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onRestart = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onIteration = createRestartIterationHook(onRestart);

    expect(onIteration()).toBe(false);
    expect(onRestart).not.toHaveBeenCalled();

    expect(onIteration()).toBe(true);
    expect(onRestart).toHaveBeenCalledTimes(1);

    expect(onIteration()).toBe(true);
    expect(onRestart).toHaveBeenCalledTimes(2);
  });
});
