/*
 * AUTO ANNOTATION
 * File: src/commands/sessions.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mockSessionsConfig() {
  vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actual = await importOriginal<typeof import("../config/config.js")>();
    return {
      ...actual,
      loadConfig: () => ({
        agents: {
          defaults: {
            model: { primary: "pi:opus" },
            models: { "pi:opus": {} },
            contextTokens: 32000,
          },
        },
      }),
    };
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeRuntime(params?: { throwOnError?: boolean }): {
  runtime: RuntimeEnv;
  logs: string[];
  errors: string[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logs: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errors: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const throwOnError = params?.throwOnError ?? false;
  return {
    runtime: {
      log: (msg: unknown) => logs.push(String(msg)),
      error: (msg: unknown) => {
        errors.push(String(msg));
        if (throwOnError) {
          throw new Error(String(msg));
        }
      },
      exit: (code: number) => {
        throw new Error(`exit ${code}`);
      },
    },
    logs,
    errors,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function writeStore(data: unknown, prefix = "sessions"): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const file = path.join(
    os.tmpdir(),
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`,
  );
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runSessionsJson<T>(
  run: (
    opts: { json?: boolean; store?: string; active?: string },
    runtime: RuntimeEnv,
  ) => Promise<void>,
  store: string,
  options?: {
    active?: string;
  },
): Promise<T> {
  const { runtime, logs } = makeRuntime();
  try {
    await run(
      {
        store,
        json: true,
        active: options?.active,
      },
      runtime,
    );
  } finally {
    fs.rmSync(store, { force: true });
  }
  return JSON.parse(logs[0] ?? "{}") as T;
}
