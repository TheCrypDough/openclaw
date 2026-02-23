/*
 * AUTO ANNOTATION
 * File: src/cron/service.get-job.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { CronService } from "./service.js";
import {
  createCronStoreHarness,
  createNoopLogger,
  installCronTestHooks,
} from "./service.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logger = createNoopLogger();
const { makeStorePath } = createCronStoreHarness({ prefix: "openclaw-cron-get-job-" });
installCronTestHooks({ logger });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createCronService(storePath: string) {
  return new CronService({
    storePath,
    cronEnabled: true,
    log: logger,
    enqueueSystemEvent: vi.fn(),
    requestHeartbeatNow: vi.fn(),
    runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
  });
}

describe("CronService.getJob", () => {
  it("returns added jobs and undefined for missing ids", async () => {
    const { storePath } = await makeStorePath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cron = createCronService(storePath);
    await cron.start();

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const added = await cron.add({
        name: "lookup-test",
        enabled: true,
        schedule: { kind: "every", everyMs: 60_000 },
        sessionTarget: "main",
        wakeMode: "next-heartbeat",
        payload: { kind: "systemEvent", text: "ping" },
      });

      expect(cron.getJob(added.id)?.id).toBe(added.id);
      expect(cron.getJob("missing-job-id")).toBeUndefined();
    } finally {
      cron.stop();
    }
  });

  it("preserves webhook delivery on create", async () => {
    const { storePath } = await makeStorePath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cron = createCronService(storePath);
    await cron.start();

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const webhookJob = await cron.add({
        name: "webhook-job",
        enabled: true,
        schedule: { kind: "every", everyMs: 60_000 },
        sessionTarget: "main",
        wakeMode: "next-heartbeat",
        payload: { kind: "systemEvent", text: "ping" },
        delivery: { mode: "webhook", to: "https://example.invalid/cron" },
      });
      expect(cron.getJob(webhookJob.id)?.delivery).toEqual({
        mode: "webhook",
        to: "https://example.invalid/cron",
      });
    } finally {
      cron.stop();
    }
  });
});
