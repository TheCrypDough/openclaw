/*
 * AUTO ANNOTATION
 * File: src/process/supervisor/supervisor.pty-command.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { createPtyAdapterMock } = vi.hoisted(() => ({
  createPtyAdapterMock: vi.fn(),
}));

vi.mock("../../agents/shell-utils.js", () => ({
  getShellConfig: () => ({ shell: "sh", args: ["-c"] }),
}));

vi.mock("./adapters/pty.js", () => ({
  createPtyAdapter: (...args: unknown[]) => createPtyAdapterMock(...args),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createStubPtyAdapter() {
  return {
    pid: 1234,
    stdin: undefined,
    onStdout: (_listener: (chunk: string) => void) => {
      // no-op
    },
    onStderr: (_listener: (chunk: string) => void) => {
      // no-op
    },
    wait: async () => ({ code: 0, signal: null }),
    kill: (_signal?: NodeJS.Signals) => {
      // no-op
    },
    dispose: () => {
      // no-op
    },
  };
}

describe("process supervisor PTY command contract", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let createProcessSupervisor: typeof import("./supervisor.js").createProcessSupervisor;

  beforeAll(async () => {
    ({ createProcessSupervisor } = await import("./supervisor.js"));
  });

  beforeEach(() => {
    createPtyAdapterMock.mockReset();
  });

  it("passes PTY command verbatim to shell args", async () => {
    createPtyAdapterMock.mockResolvedValue(createStubPtyAdapter());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const supervisor = createProcessSupervisor();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const command = `printf '%s\\n' "a b" && printf '%s\\n' '$HOME'`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = await supervisor.spawn({
      sessionId: "s1",
      backendId: "test",
      mode: "pty",
      ptyCommand: command,
      timeoutMs: 1_000,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exit = await run.wait();

    expect(exit.reason).toBe("exit");
    expect(createPtyAdapterMock).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = createPtyAdapterMock.mock.calls[0]?.[0] as { args?: string[] };
    expect(params.args).toEqual(["-c", command]);
  });

  it("rejects empty PTY command", async () => {
    createPtyAdapterMock.mockResolvedValue(createStubPtyAdapter());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const supervisor = createProcessSupervisor();

    await expect(
      supervisor.spawn({
        sessionId: "s1",
        backendId: "test",
        mode: "pty",
        ptyCommand: "   ",
      }),
    ).rejects.toThrow("PTY command cannot be empty");
    expect(createPtyAdapterMock).not.toHaveBeenCalled();
  });
});
