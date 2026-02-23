/*
 * AUTO ANNOTATION
 * File: src/agents/claude-cli-runner.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { runClaudeCliAgent } from "./claude-cli-runner.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock("../process/supervisor/index.js", () => ({
  getProcessSupervisor: () => ({
    spawn: (...args: unknown[]) => mocks.spawn(...args),
    cancel: vi.fn(),
    cancelScope: vi.fn(),
    reconcileOrphans: async () => {},
    getRecord: vi.fn(),
  }),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDeferred<T>() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let resolve: (value: T) => void = () => {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let reject: (error: unknown) => void = () => {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve as (value: T) => void,
    reject: reject as (error: unknown) => void,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createManagedRun(
  exit: Promise<{
    reason: "exit" | "overall-timeout" | "no-output-timeout" | "signal" | "manual-cancel";
    exitCode: number | null;
    exitSignal: NodeJS.Signals | null;
    durationMs: number;
    stdout: string;
    stderr: string;
    timedOut: boolean;
    noOutputTimedOut: boolean;
  }>,
) {
  return {
    runId: "run-test",
    pid: 12345,
    startedAtMs: Date.now(),
    wait: async () => await exit,
    cancel: vi.fn(),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function successExit(payload: { message: string; session_id: string }) {
  return {
    reason: "exit" as const,
    exitCode: 0,
    exitSignal: null,
    durationMs: 1,
    stdout: JSON.stringify(payload),
    stderr: "",
    timedOut: false,
    noOutputTimedOut: false,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitForCalls(mockFn: { mock: { calls: unknown[][] } }, count: number) {
  await vi.waitFor(
    () => {
      expect(mockFn.mock.calls.length).toBeGreaterThanOrEqual(count);
    },
    { timeout: 2_000, interval: 5 },
  );
}

describe("runClaudeCliAgent", () => {
  beforeEach(() => {
    mocks.spawn.mockReset();
  });

  it("starts a new session with --session-id when none is provided", async () => {
    mocks.spawn.mockResolvedValueOnce(
      createManagedRun(Promise.resolve(successExit({ message: "ok", session_id: "sid-1" }))),
    );

    await runClaudeCliAgent({
      sessionId: "openclaw-session",
      sessionFile: "/tmp/session.jsonl",
      workspaceDir: "/tmp",
      prompt: "hi",
      model: "opus",
      timeoutMs: 1_000,
      runId: "run-1",
    });

    expect(mocks.spawn).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawnInput = mocks.spawn.mock.calls[0]?.[0] as { argv: string[]; mode: string };
    expect(spawnInput.mode).toBe("child");
    expect(spawnInput.argv).toContain("claude");
    expect(spawnInput.argv).toContain("--session-id");
    expect(spawnInput.argv).toContain("hi");
  });

  it("uses --resume when a claude session id is provided", async () => {
    mocks.spawn.mockResolvedValueOnce(
      createManagedRun(Promise.resolve(successExit({ message: "ok", session_id: "sid-2" }))),
    );

    await runClaudeCliAgent({
      sessionId: "openclaw-session",
      sessionFile: "/tmp/session.jsonl",
      workspaceDir: "/tmp",
      prompt: "hi",
      model: "opus",
      timeoutMs: 1_000,
      runId: "run-2",
      claudeSessionId: "c9d7b831-1c31-4d22-80b9-1e50ca207d4b",
    });

    expect(mocks.spawn).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawnInput = mocks.spawn.mock.calls[0]?.[0] as { argv: string[] };
    expect(spawnInput.argv).toContain("--resume");
    expect(spawnInput.argv).toContain("c9d7b831-1c31-4d22-80b9-1e50ca207d4b");
    expect(spawnInput.argv).not.toContain("--session-id");
    expect(spawnInput.argv).toContain("hi");
  });

  it("serializes concurrent claude-cli runs", async () => {
    const firstDeferred = createDeferred<ReturnType<typeof successExit>>();
    const secondDeferred = createDeferred<ReturnType<typeof successExit>>();

    mocks.spawn
      .mockResolvedValueOnce(createManagedRun(firstDeferred.promise))
      .mockResolvedValueOnce(createManagedRun(secondDeferred.promise));

    const firstRun = runClaudeCliAgent({
      sessionId: "s1",
      sessionFile: "/tmp/session.jsonl",
      workspaceDir: "/tmp",
      prompt: "first",
      model: "opus",
      timeoutMs: 1_000,
      runId: "run-1",
    });

    const secondRun = runClaudeCliAgent({
      sessionId: "s2",
      sessionFile: "/tmp/session.jsonl",
      workspaceDir: "/tmp",
      prompt: "second",
      model: "opus",
      timeoutMs: 1_000,
      runId: "run-2",
    });

    await waitForCalls(mocks.spawn, 1);

    firstDeferred.resolve(successExit({ message: "ok", session_id: "sid-1" }));

    await waitForCalls(mocks.spawn, 2);

    secondDeferred.resolve(successExit({ message: "ok", session_id: "sid-2" }));

    await Promise.all([firstRun, secondRun]);
  });
});
