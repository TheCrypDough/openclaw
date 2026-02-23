/*
 * AUTO ANNOTATION
 * File: src/process/kill-tree.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_GRACE_MS = 3000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_GRACE_MS = 60_000;

/**
 * Best-effort process-tree termination with graceful shutdown.
 * - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
 *   first (without /F), then force-kills if process survives.
 * - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
 *
 * This gives child processes a chance to clean up (close connections, remove
 * temp files, terminate their own children) before being hard-killed.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function killProcessTree(pid: number, opts?: { graceMs?: number }): void {
  if (!Number.isFinite(pid) || pid <= 0) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const graceMs = normalizeGraceMs(opts?.graceMs);

  if (process.platform === "win32") {
    killProcessTreeWindows(pid, graceMs);
    return;
  }

  killProcessTreeUnix(pid, graceMs);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeGraceMs(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_GRACE_MS;
  }
  return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function killProcessTreeUnix(pid: number, graceMs: number): void {
  // Step 1: Try graceful SIGTERM to process group
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    // Process group doesn't exist or we lack permission - try direct
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Already gone
      return;
    }
  }

  // Step 2: Wait grace period, then SIGKILL if still alive
  setTimeout(() => {
    if (isProcessAlive(-pid)) {
      try {
        process.kill(-pid, "SIGKILL");
        return;
      } catch {
        // Fall through to direct pid kill
      }
    }
    if (!isProcessAlive(pid)) {
      return;
    }
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Process exited between liveness check and kill
    }
  }, graceMs).unref(); // Don't block event loop exit
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function runTaskkill(args: string[]): void {
  try {
    spawn("taskkill", args, {
      stdio: "ignore",
      detached: true,
    });
  } catch {
    // Ignore taskkill spawn failures
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function killProcessTreeWindows(pid: number, graceMs: number): void {
  // Step 1: Try graceful termination (taskkill without /F)
  runTaskkill(["/T", "/PID", String(pid)]);

  // Step 2: Wait grace period, then force kill only if pid still exists.
  // This avoids unconditional delayed /F kills after graceful shutdown.
  setTimeout(() => {
    if (!isProcessAlive(pid)) {
      return;
    }
    runTaskkill(["/F", "/T", "/PID", String(pid)]);
  }, graceMs).unref(); // Don't block event loop exit
}
