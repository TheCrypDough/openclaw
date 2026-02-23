/*
 * AUTO ANNOTATION
 * File: src/process/child-process-bridge.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { afterEach, describe, expect, it } from "vitest";
import { attachChildProcessBridge } from "./child-process-bridge.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CHILD_READY_TIMEOUT_MS = 2_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CHILD_EXIT_TIMEOUT_MS = 3_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function waitForLine(
  stream: NodeJS.ReadableStream,
  timeoutMs = CHILD_READY_TIMEOUT_MS,
): Promise<string> {
  return new Promise((resolve, reject) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let buffer = "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("timeout waiting for line"));
    }, timeoutMs);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onData = (chunk: Buffer | string): void => {
      buffer += chunk.toString();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const idx = buffer.indexOf("\n");
      if (idx >= 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const line = buffer.slice(0, idx).trim();
        cleanup();
        resolve(line);
      }
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onError = (err: unknown): void => {
      cleanup();
      reject(err);
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cleanup = (): void => {
      clearTimeout(timeout);
      stream.off("data", onData);
      stream.off("error", onError);
    };

    stream.on("data", onData);
    stream.on("error", onError);
  });
}

describe("attachChildProcessBridge", () => {
  const children: Array<{ kill: (signal?: NodeJS.Signals) => boolean }> = [];
  const detachments: Array<() => void> = [];

  afterEach(() => {
    for (const detach of detachments) {
      try {
        detach();
      } catch {
        // ignore
      }
    }
    detachments.length = 0;
    for (const child of children) {
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore
      }
    }
    children.length = 0;
  });

  it("forwards SIGTERM to the wrapped child", async () => {
    const childPath = path.resolve(process.cwd(), "test/fixtures/child-process-bridge/child.js");

    const beforeSigterm = new Set(process.listeners("SIGTERM"));
    const child = spawn(process.execPath, [childPath], {
      stdio: ["ignore", "pipe", "inherit"],
      env: process.env,
    });
    const { detach } = attachChildProcessBridge(child);
    detachments.push(detach);
    children.push(child);
    const afterSigterm = process.listeners("SIGTERM");
    const addedSigterm = afterSigterm.find((listener) => !beforeSigterm.has(listener));

    if (!child.stdout) {
      throw new Error("expected stdout");
    }
    const ready = await waitForLine(child.stdout);
    expect(ready).toBe("ready");

    // Simulate systemd sending SIGTERM to the parent process.
    if (!addedSigterm) {
      throw new Error("expected SIGTERM listener");
    }
    addedSigterm("SIGTERM");

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("timeout waiting for child exit")),
        CHILD_EXIT_TIMEOUT_MS,
      );
      child.once("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }, 8_000);
});
