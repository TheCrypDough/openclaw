/*
 * AUTO ANNOTATION
 * File: src/cron/isolated-agent.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";
import type { OpenClawConfig } from "../config/config.js";
import type { CronJob } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempCronHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(fn, { prefix: "openclaw-cron-" });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeSessionStore(
  home: string,
  session: { lastProvider: string; lastTo: string; lastChannel?: string },
): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.join(home, ".openclaw", "sessions");
  await fs.mkdir(dir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = path.join(dir, "sessions.json");
  await fs.writeFile(
    storePath,
    JSON.stringify(
      {
        "agent:main:main": {
          sessionId: "main-session",
          updatedAt: Date.now(),
          ...session,
        },
      },
      null,
      2,
    ),
    "utf-8",
  );
  return storePath;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeCfg(
  home: string,
  storePath: string,
  overrides: Partial<OpenClawConfig> = {},
): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base: OpenClawConfig = {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-5",
        workspace: path.join(home, "openclaw"),
      },
    },
    session: { store: storePath, mainKey: "main" },
  } as OpenClawConfig;
  return { ...base, ...overrides };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeJob(payload: CronJob["payload"]): CronJob {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
  return {
    id: "job-1",
    name: "job-1",
    enabled: true,
    createdAtMs: now,
    updatedAtMs: now,
    schedule: { kind: "every", everyMs: 60_000 },
    sessionTarget: "isolated",
    wakeMode: "now",
    payload,
    state: {},
  };
}
