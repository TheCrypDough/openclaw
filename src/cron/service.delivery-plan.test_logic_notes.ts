/*
 * AUTO ANNOTATION
 * File: src/cron/service.delivery-plan.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { ChannelId } from "../channels/plugins/types.js";
import { CronService, type CronServiceDeps } from "./service.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const noopLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function makeStorePath() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-cron-delivery-"));
  return {
    storePath: path.join(dir, "cron", "jobs.json"),
    cleanup: async () => {
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DeliveryMode = "none" | "announce";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DeliveryOverride = {
  mode: DeliveryMode;
  channel?: ChannelId | "last";
  to?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withCronService(
  params: {
    runIsolatedAgentJob?: CronServiceDeps["runIsolatedAgentJob"];
  },
  run: (context: {
    cron: CronService;
    enqueueSystemEvent: ReturnType<typeof vi.fn>;
    requestHeartbeatNow: ReturnType<typeof vi.fn>;
  }) => Promise<void>,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = await makeStorePath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enqueueSystemEvent = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestHeartbeatNow = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cron = new CronService({
    cronEnabled: true,
    storePath: store.storePath,
    log: noopLogger,
    enqueueSystemEvent,
    requestHeartbeatNow,
    runIsolatedAgentJob:
      params.runIsolatedAgentJob ??
      (vi.fn(async () => ({ status: "ok" as const, summary: "done" })) as never),
  });

  await cron.start();
  try {
    await run({ cron, enqueueSystemEvent, requestHeartbeatNow });
  } finally {
    cron.stop();
    await store.cleanup();
  }
}

async function addIsolatedAgentTurnJob(
  cron: CronService,
  params: {
    name: string;
    wakeMode: "next-heartbeat" | "now";
    payload?: { deliver?: boolean };
    delivery?: DeliveryOverride;
  },
) {
  return cron.add({
    name: params.name,
    enabled: true,
    schedule: { kind: "every", everyMs: 60_000, anchorMs: Date.now() },
    sessionTarget: "isolated",
    wakeMode: params.wakeMode,
    payload: {
      kind: "agentTurn",
      message: "hello",
      ...params.payload,
    } as unknown as { kind: "agentTurn"; message: string },
    ...(params.delivery
      ? {
          delivery: params.delivery as unknown as {
            mode: DeliveryMode;
            channel?: string;
            to?: string;
          },
        }
      : {}),
  });
}

describe("CronService delivery plan consistency", () => {
  it("does not post isolated summary when legacy deliver=false", async () => {
    await withCronService({}, async ({ cron, enqueueSystemEvent }) => {
      const job = await addIsolatedAgentTurnJob(cron, {
        name: "legacy-off",
        wakeMode: "next-heartbeat",
        payload: { deliver: false },
      });

      const result = await cron.run(job.id, "force");
      expect(result).toEqual({ ok: true, ran: true });
      expect(enqueueSystemEvent).not.toHaveBeenCalled();
    });
  });

  it("treats delivery object without mode as announce", async () => {
    await withCronService({}, async ({ cron, enqueueSystemEvent }) => {
      const job = await addIsolatedAgentTurnJob(cron, {
        name: "partial-delivery",
        wakeMode: "next-heartbeat",
        delivery: { channel: "telegram", to: "123" } as DeliveryOverride,
      });

      const result = await cron.run(job.id, "force");
      expect(result).toEqual({ ok: true, ran: true });
      expect(enqueueSystemEvent).toHaveBeenCalledWith(
        "Cron: done",
        expect.objectContaining({ agentId: undefined }),
      );
    });
  });

  it("does not enqueue duplicate relay when isolated run marks delivery handled", async () => {
    await withCronService(
      {
        runIsolatedAgentJob: vi.fn(async () => ({
          status: "ok" as const,
          summary: "done",
          delivered: true,
        })),
      },
      async ({ cron, enqueueSystemEvent, requestHeartbeatNow }) => {
        const job = await addIsolatedAgentTurnJob(cron, {
          name: "announce-delivered",
          wakeMode: "now",
          delivery: { channel: "telegram", to: "123" } as DeliveryOverride,
        });

        const result = await cron.run(job.id, "force");
        expect(result).toEqual({ ok: true, ran: true });
        expect(enqueueSystemEvent).not.toHaveBeenCalled();
        expect(requestHeartbeatNow).not.toHaveBeenCalled();
      },
    );
  });
});
