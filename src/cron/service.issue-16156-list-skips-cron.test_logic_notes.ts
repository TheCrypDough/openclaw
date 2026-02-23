/*
 * AUTO ANNOTATION
 * File: src/cron/service.issue-16156-list-skips-cron.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CronService } from "./service.js";
import { createStartedCronServiceWithFinishedBarrier } from "./service.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const noopLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let fixtureRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let caseId = 0;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function makeStorePath() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.join(fixtureRoot, `case-${caseId++}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = path.join(dir, "cron", "jobs.json");
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  return { storePath };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function writeJobsStore(storePath: string, jobs: unknown[]) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify({ version: 1, jobs }, null, 2), "utf-8");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createCronFromStorePath(storePath: string) {
  return new CronService({
    storePath,
    cronEnabled: true,
    log: noopLogger,
    enqueueSystemEvent: vi.fn(),
    requestHeartbeatNow: vi.fn(),
    runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
  });
}

describe("#16156: cron.list() must not silently advance past-due recurring jobs", () => {
  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-cron-16156-"));
  });

  afterAll(async () => {
    if (fixtureRoot) {
      await fs.rm(fixtureRoot, { recursive: true, force: true }).catch(() => undefined);
    }
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-13T00:00:00.000Z"));
    noopLogger.debug.mockClear();
    noopLogger.info.mockClear();
    noopLogger.warn.mockClear();
    noopLogger.error.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not skip a cron job when list() is called while the job is past-due", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = await makeStorePath();
    const { cron, enqueueSystemEvent, finished } = createStartedCronServiceWithFinishedBarrier({
      storePath: store.storePath,
      logger: noopLogger,
    });

    await cron.start();

    // Create a cron job that fires every minute.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const job = await cron.add({
      name: "every-minute",
      enabled: true,
      schedule: { kind: "cron", expr: "* * * * *" },
      sessionTarget: "main",
      wakeMode: "next-heartbeat",
      payload: { kind: "systemEvent", text: "cron-tick" },
    });

    const firstDueAt = job.state.nextRunAtMs!;
    expect(firstDueAt).toBe(Date.parse("2025-12-13T00:01:00.000Z"));

    // Advance time so the job is past-due but the timer hasn't fired yet.
    vi.setSystemTime(new Date(firstDueAt + 5));

    // Simulate the user running `cron list` while the job is past-due.
    // Before the fix, this would call recomputeNextRuns() which silently
    // advances nextRunAtMs to the next occurrence (00:02:00) without
    // executing the job.
    const listedBefore = await cron.list({ includeDisabled: true });
    const jobBeforeTimer = listedBefore.find((j) => j.id === job.id);

    // The job should still show the past-due nextRunAtMs, NOT the advanced one.
    expect(jobBeforeTimer?.state.nextRunAtMs).toBe(firstDueAt);

    // Now let the timer fire. The job should be found as due and execute.
    await vi.runOnlyPendingTimersAsync();

    await finished.waitForOk(job.id);

    const jobs = await cron.list({ includeDisabled: true });
    const updated = jobs.find((j) => j.id === job.id);

    // Job must have actually executed.
    expect(enqueueSystemEvent).toHaveBeenCalledWith(
      "cron-tick",
      expect.objectContaining({ agentId: undefined }),
    );
    expect(updated?.state.lastStatus).toBe("ok");
    // nextRunAtMs must advance to a future minute boundary after execution.
    expect(updated?.state.nextRunAtMs).toBeGreaterThan(firstDueAt);

    cron.stop();
  });

  it("does not skip a cron job when status() is called while the job is past-due", async () => {
    const store = await makeStorePath();
    const { cron, enqueueSystemEvent, finished } = createStartedCronServiceWithFinishedBarrier({
      storePath: store.storePath,
      logger: noopLogger,
    });

    await cron.start();

    const job = await cron.add({
      name: "five-min-cron",
      enabled: true,
      schedule: { kind: "cron", expr: "*/5 * * * *" },
      sessionTarget: "main",
      wakeMode: "next-heartbeat",
      payload: { kind: "systemEvent", text: "tick-5" },
    });

    const firstDueAt = job.state.nextRunAtMs!;

    // Advance time past due.
    vi.setSystemTime(new Date(firstDueAt + 10));

    // Call status() while job is past-due.
    await cron.status();

    // Timer fires.
    await vi.runOnlyPendingTimersAsync();

    await finished.waitForOk(job.id);

    const jobs = await cron.list({ includeDisabled: true });
    const updated = jobs.find((j) => j.id === job.id);

    expect(enqueueSystemEvent).toHaveBeenCalledWith(
      "tick-5",
      expect.objectContaining({ agentId: undefined }),
    );
    expect(updated?.state.lastStatus).toBe("ok");

    cron.stop();
  });

  it("still fills missing nextRunAtMs via list() for enabled jobs", async () => {
    const store = await makeStorePath();
    const nowMs = Date.parse("2025-12-13T00:00:00.000Z");

    // Write a store file with a cron job that has no nextRunAtMs.
    await writeJobsStore(store.storePath, [
      {
        id: "missing-next",
        name: "missing next",
        enabled: true,
        createdAtMs: nowMs,
        updatedAtMs: nowMs,
        schedule: { kind: "cron", expr: "* * * * *", tz: "UTC" },
        sessionTarget: "main",
        wakeMode: "now",
        payload: { kind: "systemEvent", text: "fill-me" },
        state: {},
      },
    ]);

    const cron = createCronFromStorePath(store.storePath);

    await cron.start();

    // list() should fill in the missing nextRunAtMs via maintenance recompute.
    const jobs = await cron.list({ includeDisabled: true });
    const job = jobs.find((j) => j.id === "missing-next");

    expect(job?.state.nextRunAtMs).toBeTypeOf("number");
    expect(job?.state.nextRunAtMs).toBeGreaterThan(nowMs);

    cron.stop();
  });
});
