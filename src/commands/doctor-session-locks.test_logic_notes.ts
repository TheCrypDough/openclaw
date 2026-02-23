/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-session-locks.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureEnv } from "../test-utils/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const note = vi.hoisted(() => vi.fn());

vi.mock("../terminal/note.js", () => ({
  note,
}));

import { noteSessionLockHealth } from "./doctor-session-locks.js";

describe("noteSessionLockHealth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let root: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: ReturnType<typeof captureEnv>;

  beforeEach(async () => {
    note.mockReset();
    envSnapshot = captureEnv(["OPENCLAW_STATE_DIR"]);
    root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-doctor-locks-"));
    process.env.OPENCLAW_STATE_DIR = root;
  });

  afterEach(async () => {
    envSnapshot.restore();
    await fs.rm(root, { recursive: true, force: true });
  });

  it("reports existing lock files with pid status and age", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionsDir = path.join(root, "agents", "main", "sessions");
    await fs.mkdir(sessionsDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lockPath = path.join(sessionsDir, "active.jsonl.lock");
    await fs.writeFile(
      lockPath,
      JSON.stringify({ pid: process.pid, createdAt: new Date(Date.now() - 1500).toISOString() }),
      "utf8",
    );

    await noteSessionLockHealth({ shouldRepair: false, staleMs: 60_000 });

    expect(note).toHaveBeenCalledTimes(1);
    const [message, title] = note.mock.calls[0] as [string, string];
    expect(title).toBe("Session locks");
    expect(message).toContain("Found 1 session lock file");
    expect(message).toContain(`pid=${process.pid} (alive)`);
    expect(message).toContain("stale=no");
    await expect(fs.access(lockPath)).resolves.toBeUndefined();
  });

  it("removes stale locks in repair mode", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionsDir = path.join(root, "agents", "main", "sessions");
    await fs.mkdir(sessionsDir, { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const staleLock = path.join(sessionsDir, "stale.jsonl.lock");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const freshLock = path.join(sessionsDir, "fresh.jsonl.lock");

    await fs.writeFile(
      staleLock,
      JSON.stringify({ pid: -1, createdAt: new Date(Date.now() - 120_000).toISOString() }),
      "utf8",
    );
    await fs.writeFile(
      freshLock,
      JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }),
      "utf8",
    );

    await noteSessionLockHealth({ shouldRepair: true, staleMs: 30_000 });

    expect(note).toHaveBeenCalledTimes(1);
    const [message] = note.mock.calls[0] as [string, string];
    expect(message).toContain("[removed]");
    expect(message).toContain("Removed 1 stale session lock file");

    await expect(fs.access(staleLock)).rejects.toThrow();
    await expect(fs.access(freshLock)).resolves.toBeUndefined();
  });
});
