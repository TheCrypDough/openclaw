/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-runner.test-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";
import * as replyModule from "../auto-reply/reply.js";

export type HeartbeatSessionSeed = {
  sessionId?: string;
  updatedAt?: number;
  lastChannel: string;
  lastProvider: string;
  lastTo: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function seedSessionStore(
  storePath: string,
  sessionKey: string,
  session: HeartbeatSessionSeed,
): Promise<void> {
  await fs.writeFile(
    storePath,
    JSON.stringify(
      {
        [sessionKey]: {
          sessionId: session.sessionId ?? "sid",
          updatedAt: session.updatedAt ?? Date.now(),
          ...session,
        },
      },
      null,
      2,
    ),
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempHeartbeatSandbox<T>(
  fn: (ctx: {
    tmpDir: string;
    storePath: string;
    replySpy: ReturnType<typeof vi.spyOn>;
  }) => Promise<T>,
  options?: {
    prefix?: string;
    unsetEnvVars?: string[];
  },
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), options?.prefix ?? "openclaw-hb-"));
  await fs.writeFile(path.join(tmpDir, "HEARTBEAT.md"), "- Check status\n", "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = path.join(tmpDir, "sessions.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replySpy = vi.spyOn(replyModule, "getReplyFromConfig");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const previousEnv = new Map<string, string | undefined>();
  for (const envName of options?.unsetEnvVars ?? []) {
    previousEnv.set(envName, process.env[envName]);
    process.env[envName] = "";
  }
  try {
    return await fn({ tmpDir, storePath, replySpy });
  } finally {
    replySpy.mockRestore();
    for (const [envName, previousValue] of previousEnv.entries()) {
      if (previousValue === undefined) {
        delete process.env[envName];
      } else {
        process.env[envName] = previousValue;
      }
    }
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
