/*
 * AUTO ANNOTATION
 * File: src/cron/service.persists-delivered-status.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { CronService } from "./service.js";
import {
  createStartedCronServiceWithFinishedBarrier,
  createCronStoreHarness,
  createNoopLogger,
  installCronTestHooks,
} from "./service.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const noopLogger = createNoopLogger();
const { makeStorePath } = createCronStoreHarness();
installCronTestHooks({ logger: noopLogger });

describe("CronService persists delivered status", () => {
  it("persists lastDelivered=true when isolated job reports delivered", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = await makeStorePath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finished = {
      resolvers: new Map<string, () => void>(),
      waitForOk(jobId: string) {
        return new Promise<void>((resolve) => {
          this.resolvers.set(jobId, resolve);
        });
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cron = new CronService({
      storePath: store.storePath,
      cronEnabled: true,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeatNow: vi.fn(),
      runIsolatedAgentJob: vi.fn(async () => ({
        status: "ok" as const,
        summary: "done",
        delivered: true,
      })),
      onEvent: (evt) => {
        if (evt.action === "finished" && evt.status === "ok") {
          finished.resolvers.get(evt.jobId)?.();
          finished.resolvers.delete(evt.jobId);
        }
      },
    });

    await cron.start();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const job = await cron.add({
      name: "delivered-true",
      enabled: true,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "next-heartbeat",
      payload: { kind: "agentTurn", message: "test" },
      delivery: { mode: "none" },
    });

    vi.setSystemTime(new Date(job.state.nextRunAtMs! + 5));
    await vi.runOnlyPendingTimersAsync();
    await finished.waitForOk(job.id);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const jobs = await cron.list({ includeDisabled: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const updated = jobs.find((j) => j.id === job.id);

    expect(updated?.state.lastStatus).toBe("ok");
    expect(updated?.state.lastDelivered).toBe(true);

    cron.stop();
  });

  it("persists lastDelivered=undefined when isolated job does not deliver", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = await makeStorePath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finished = {
      resolvers: new Map<string, () => void>(),
      waitForOk(jobId: string) {
        return new Promise<void>((resolve) => {
          this.resolvers.set(jobId, resolve);
        });
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cron = new CronService({
      storePath: store.storePath,
      cronEnabled: true,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeatNow: vi.fn(),
      runIsolatedAgentJob: vi.fn(async () => ({
        status: "ok" as const,
        summary: "done",
      })),
      onEvent: (evt) => {
        if (evt.action === "finished" && evt.status === "ok") {
          finished.resolvers.get(evt.jobId)?.();
          finished.resolvers.delete(evt.jobId);
        }
      },
    });

    await cron.start();
    const job = await cron.add({
      name: "no-delivery",
      enabled: true,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "next-heartbeat",
      payload: { kind: "agentTurn", message: "test" },
      delivery: { mode: "none" },
    });

    vi.setSystemTime(new Date(job.state.nextRunAtMs! + 5));
    await vi.runOnlyPendingTimersAsync();
    await finished.waitForOk(job.id);

    const jobs = await cron.list({ includeDisabled: true });
    const updated = jobs.find((j) => j.id === job.id);

    expect(updated?.state.lastStatus).toBe("ok");
    expect(updated?.state.lastDelivered).toBeUndefined();

    cron.stop();
  });

  it("does not set lastDelivered for main session jobs", async () => {
    const store = await makeStorePath();
    const { cron, enqueueSystemEvent, finished } = createStartedCronServiceWithFinishedBarrier({
      storePath: store.storePath,
      logger: noopLogger,
    });

    await cron.start();
    const job = await cron.add({
      name: "main-session",
      enabled: true,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "main",
      wakeMode: "next-heartbeat",
      payload: { kind: "systemEvent", text: "tick" },
    });

    vi.setSystemTime(new Date(job.state.nextRunAtMs! + 5));
    await vi.runOnlyPendingTimersAsync();
    await finished.waitForOk(job.id);

    const jobs = await cron.list({ includeDisabled: true });
    const updated = jobs.find((j) => j.id === job.id);

    expect(updated?.state.lastStatus).toBe("ok");
    expect(updated?.state.lastDelivered).toBeUndefined();
    expect(enqueueSystemEvent).toHaveBeenCalled();

    cron.stop();
  });

  it("emits delivered in the finished event", async () => {
    const store = await makeStorePath();
    let capturedEvent: { jobId: string; delivered?: boolean } | undefined;
    const finished = {
      resolvers: new Map<string, () => void>(),
      waitForOk(jobId: string) {
        return new Promise<void>((resolve) => {
          this.resolvers.set(jobId, resolve);
        });
      },
    };

    const cron = new CronService({
      storePath: store.storePath,
      cronEnabled: true,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeatNow: vi.fn(),
      runIsolatedAgentJob: vi.fn(async () => ({
        status: "ok" as const,
        summary: "done",
        delivered: true,
      })),
      onEvent: (evt) => {
        if (evt.action === "finished") {
          capturedEvent = { jobId: evt.jobId, delivered: evt.delivered };
          if (evt.status === "ok") {
            finished.resolvers.get(evt.jobId)?.();
            finished.resolvers.delete(evt.jobId);
          }
        }
      },
    });

    await cron.start();
    const job = await cron.add({
      name: "event-test",
      enabled: true,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "next-heartbeat",
      payload: { kind: "agentTurn", message: "test" },
      delivery: { mode: "none" },
    });

    vi.setSystemTime(new Date(job.state.nextRunAtMs! + 5));
    await vi.runOnlyPendingTimersAsync();
    await finished.waitForOk(job.id);

    expect(capturedEvent).toBeDefined();
    expect(capturedEvent?.delivered).toBe(true);

    // Flush pending store writes before stopping so the temp file is released
    // (prevents ENOTEMPTY on Windows when afterAll removes the fixture dir).
    await cron.list({ includeDisabled: true });
    cron.stop();
  });
});
