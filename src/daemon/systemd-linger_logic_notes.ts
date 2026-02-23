/*
 * AUTO ANNOTATION
 * File: src/daemon/systemd-linger.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import os from "node:os";
import { runCommandWithTimeout, runExec } from "../process/exec.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveLoginctlUser(env: Record<string, string | undefined>): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromEnv = env.USER?.trim() || env.LOGNAME?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  try {
    return os.userInfo().username;
  } catch {
    return null;
  }
}

export type SystemdUserLingerStatus = {
  user: string;
  linger: "yes" | "no";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readSystemdUserLingerStatus(
  env: Record<string, string | undefined>,
): Promise<SystemdUserLingerStatus | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const user = resolveLoginctlUser(env);
  if (!user) {
    return null;
  }
  try {
    const { stdout } = await runExec("loginctl", ["show-user", user, "-p", "Linger"], {
      timeoutMs: 5_000,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = stdout
      .split("\n")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith("Linger="));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = line?.split("=")[1]?.trim().toLowerCase();
    if (value === "yes" || value === "no") {
      return { user, linger: value };
    }
  } catch {
    // ignore; loginctl may be unavailable
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function enableSystemdUserLinger(params: {
  env: Record<string, string | undefined>;
  user?: string;
  sudoMode?: "prompt" | "non-interactive";
}): Promise<{ ok: boolean; stdout: string; stderr: string; code: number }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const user = params.user ?? resolveLoginctlUser(params.env);
  if (!user) {
    return { ok: false, stdout: "", stderr: "Missing user", code: 1 };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const needsSudo = typeof process.getuid === "function" ? process.getuid() !== 0 : true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sudoArgs =
    needsSudo && params.sudoMode !== undefined
      ? ["sudo", ...(params.sudoMode === "non-interactive" ? ["-n"] : [])]
      : [];
  const argv = [...sudoArgs, "loginctl", "enable-linger", user];
  try {
    const result = await runCommandWithTimeout(argv, { timeoutMs: 30_000 });
    return {
      ok: result.code === 0,
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code ?? 1,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, stdout: "", stderr: message, code: 1 };
  }
}
