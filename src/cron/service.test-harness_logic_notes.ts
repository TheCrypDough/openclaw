/*
 * AUTO ANNOTATION
 * File: src/cron/service.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";
import type { CronEvent } from "./service.js";
import { CronService } from "./service.js";
import { createCronServiceState } from "./service/state.js";
import type { CronJob } from "./types.js";

export type NoopLogger = {
  debug: MockFn;
  info: MockFn;
  warn: MockFn;
  error: MockFn;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createNoopLogger(): NoopLogger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createCronStoreHarness(options?: { prefix?: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let fixtureRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let caseId = 0;

  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), options?.prefix ?? "openclaw-cron-"));
  });

  afterAll(async () => {
    if (!fixtureRoot) {
      return;
    }
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function makeStorePath() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dir = path.join(fixtureRoot, `case-${caseId++}`);
    await fs.mkdir(dir, { recursive: true });
    return {
      storePath: path.join(dir, "cron", "jobs.json"),
      cleanup: async () => {},
    };
  }

  return { makeStorePath };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installCronTestHooks(options: {
  logger: ReturnType<typeof createNoopLogger>;
  baseTimeIso?: string;
}) {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(options.baseTimeIso ?? "2025-12-13T00:00:00.000Z"));
    options.logger.debug.mockClear();
    options.logger.info.mockClear();
    options.logger.warn.mockClear();
    options.logger.error.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createFinishedBarrier() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvers = new Map<string, (evt: CronEvent) => void>();
  return {
    waitForOk: (jobId: string) =>
      new Promise<CronEvent>((resolve) => {
        resolvers.set(jobId, resolve);
      }),
    onEvent: (evt: CronEvent) => {
      if (evt.action !== "finished" || evt.status !== "ok") {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const resolve = resolvers.get(evt.jobId);
      if (!resolve) {
        return;
      }
      resolvers.delete(evt.jobId);
      resolve(evt);
    },
  };
}

export function createStartedCronServiceWithFinishedBarrier(params: {
  storePath: string;
  logger: ReturnType<typeof createNoopLogger>;
}): {
  cron: CronService;
  enqueueSystemEvent: MockFn;
  requestHeartbeatNow: MockFn;
  finished: ReturnType<typeof createFinishedBarrier>;
} {
  const enqueueSystemEvent = vi.fn();
  const requestHeartbeatNow = vi.fn();
  const finished = createFinishedBarrier();
  const cron = new CronService({
    storePath: params.storePath,
    cronEnabled: true,
    log: params.logger,
    enqueueSystemEvent,
    requestHeartbeatNow,
    runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    onEvent: finished.onEvent,
  });
  return { cron, enqueueSystemEvent, requestHeartbeatNow, finished };
}

export function createRunningCronServiceState(params: {
  storePath: string;
  log: ReturnType<typeof createNoopLogger>;
  nowMs: () => number;
  jobs: CronJob[];
}) {
  const state = createCronServiceState({
    cronEnabled: true,
    storePath: params.storePath,
    log: params.log,
    nowMs: params.nowMs,
    enqueueSystemEvent: vi.fn(),
    requestHeartbeatNow: vi.fn(),
    runIsolatedAgentJob: vi.fn().mockResolvedValue({ status: "ok", summary: "ok" }),
  });
  state.running = true;
  state.store = {
    version: 1,
    jobs: params.jobs,
  };
  return state;
}
