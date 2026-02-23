/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec.pty-cleanup.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, expect, test, vi } from "vitest";
import { resetProcessRegistryForTests } from "./bash-process-registry.js";
import { createExecTool } from "./bash-tools.exec.js";

const { ptySpawnMock } = vi.hoisted(() => ({
  ptySpawnMock: vi.fn(),
}));

vi.mock("@lydell/node-pty", () => ({
  spawn: (...args: unknown[]) => ptySpawnMock(...args),
}));

afterEach(() => {
  resetProcessRegistryForTests();
  vi.clearAllMocks();
});

test("exec disposes PTY listeners after normal exit", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disposeData = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disposeExit = vi.fn();

  ptySpawnMock.mockImplementation(() => ({
    pid: 0,
    write: vi.fn(),
    onData: (listener: (value: string) => void) => {
      listener("ok");
      return { dispose: disposeData };
    },
    onExit: (listener: (event: { exitCode: number; signal?: number }) => void) => {
      listener({ exitCode: 0 });
      return { dispose: disposeExit };
    },
    kill: vi.fn(),
  }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createExecTool({ allowBackground: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await tool.execute("toolcall", {
    command: "echo ok",
    pty: true,
  });

  expect(result.details.status).toBe("completed");
  expect(disposeData).toHaveBeenCalledTimes(1);
  expect(disposeExit).toHaveBeenCalledTimes(1);
});

test("exec tears down PTY resources on timeout", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disposeData = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disposeExit = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let exitListener: ((event: { exitCode: number; signal?: number }) => void) | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const kill = vi.fn(() => {
    // Mirror real PTY behavior: process exits shortly after force-kill.
    exitListener?.({ exitCode: 137, signal: 9 });
  });

  ptySpawnMock.mockImplementation(() => ({
    pid: 0,
    write: vi.fn(),
    onData: () => ({ dispose: disposeData }),
    onExit: (listener: (event: { exitCode: number; signal?: number }) => void) => {
      exitListener = listener;
      return { dispose: disposeExit };
    },
    kill,
  }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createExecTool({ allowBackground: false });
  await expect(
    tool.execute("toolcall", {
      command: "sleep 5",
      pty: true,
      timeout: 0.01,
    }),
  ).rejects.toThrow("Command timed out");
  expect(kill).toHaveBeenCalledTimes(1);
  expect(disposeData).toHaveBeenCalledTimes(1);
  expect(disposeExit).toHaveBeenCalledTimes(1);
});
