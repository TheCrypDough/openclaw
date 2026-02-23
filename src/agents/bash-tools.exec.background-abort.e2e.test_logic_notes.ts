/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec.background-abort.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, expect, test } from "vitest";
import {
  getFinishedSession,
  getSession,
  resetProcessRegistryForTests,
} from "./bash-process-registry.js";
import { createExecTool } from "./bash-tools.exec.js";
import { killProcessTree } from "./shell-utils.js";

afterEach(() => {
  resetProcessRegistryForTests();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitForFinishedSession(sessionId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let finished = getFinishedSession(sessionId);
  await expect
    .poll(
      () => {
        finished = getFinishedSession(sessionId);
        return Boolean(finished);
      },
      {
        timeout: process.platform === "win32" ? 10_000 : 2_000,
        interval: 20,
      },
    )
    .toBe(true);
  return finished;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function cleanupRunningSession(sessionId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const running = getSession(sessionId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pid = running?.pid;
  if (pid) {
    killProcessTree(pid);
  }
  return running;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectBackgroundSessionSurvivesAbort(params: {
  tool: ReturnType<typeof createExecTool>;
  executeParams: Record<string, unknown>;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abortController = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await params.tool.execute(
    "toolcall",
    params.executeParams,
    abortController.signal,
  );
  expect(result.details.status).toBe("running");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionId = (result.details as { sessionId: string }).sessionId;

  abortController.abort();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const startedAt = Date.now();
  await expect
    .poll(
      () => {
        const running = getSession(sessionId);
        const finished = getFinishedSession(sessionId);
        return Date.now() - startedAt >= 100 && !finished && running?.exited === false;
      },
      { timeout: process.platform === "win32" ? 1_500 : 800, interval: 20 },
    )
    .toBe(true);

  const running = getSession(sessionId);
  const finished = getFinishedSession(sessionId);
  try {
    expect(finished).toBeUndefined();
    expect(running?.exited).toBe(false);
  } finally {
    cleanupRunningSession(sessionId);
  }
}

async function expectBackgroundSessionTimesOut(params: {
  tool: ReturnType<typeof createExecTool>;
  executeParams: Record<string, unknown>;
  signal?: AbortSignal;
  abortAfterStart?: boolean;
}) {
  const abortController = new AbortController();
  const signal = params.signal ?? abortController.signal;
  const result = await params.tool.execute("toolcall", params.executeParams, signal);
  expect(result.details.status).toBe("running");
  const sessionId = (result.details as { sessionId: string }).sessionId;

  if (params.abortAfterStart) {
    abortController.abort();
  }

  const finished = await waitForFinishedSession(sessionId);
  try {
    expect(finished).toBeTruthy();
    expect(finished?.status).toBe("failed");
  } finally {
    cleanupRunningSession(sessionId);
  }
}

test("background exec is not killed when tool signal aborts", async () => {
  const tool = createExecTool({ allowBackground: true, backgroundMs: 0 });
  await expectBackgroundSessionSurvivesAbort({
    tool,
    executeParams: { command: 'node -e "setTimeout(() => {}, 5000)"', background: true },
  });
});

test("pty background exec is not killed when tool signal aborts", async () => {
  const tool = createExecTool({ allowBackground: true, backgroundMs: 0 });
  await expectBackgroundSessionSurvivesAbort({
    tool,
    executeParams: { command: 'node -e "setTimeout(() => {}, 5000)"', background: true, pty: true },
  });
});

test("background exec still times out after tool signal abort", async () => {
  const tool = createExecTool({ allowBackground: true, backgroundMs: 0 });
  await expectBackgroundSessionTimesOut({
    tool,
    executeParams: {
      command: 'node -e "setTimeout(() => {}, 5000)"',
      background: true,
      timeout: 0.2,
    },
    abortAfterStart: true,
  });
});

test("yielded background exec is not killed when tool signal aborts", async () => {
  const tool = createExecTool({ allowBackground: true, backgroundMs: 10 });
  await expectBackgroundSessionSurvivesAbort({
    tool,
    executeParams: { command: 'node -e "setTimeout(() => {}, 5000)"', yieldMs: 5 },
  });
});

test("yielded background exec still times out", async () => {
  const tool = createExecTool({ allowBackground: true, backgroundMs: 10 });
  await expectBackgroundSessionTimesOut({
    tool,
    executeParams: {
      command: 'node -e "setTimeout(() => {}, 5000)"',
      yieldMs: 5,
      timeout: 0.2,
    },
  });
});
