/*
 * AUTO ANNOTATION
 * File: src/infra/process-respawn.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RespawnMode = "spawned" | "supervised" | "disabled" | "failed";

export type GatewayRespawnResult = {
  mode: RespawnMode;
  pid?: number;
  detail?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SUPERVISOR_HINT_ENV_VARS = [
  "LAUNCH_JOB_LABEL",
  "LAUNCH_JOB_NAME",
  "INVOCATION_ID",
  "SYSTEMD_EXEC_PID",
  "JOURNAL_STREAM",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isLikelySupervisedProcess(env: NodeJS.ProcessEnv = process.env): boolean {
  return SUPERVISOR_HINT_ENV_VARS.some((key) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

/**
 * Attempt to restart this process with a fresh PID.
 * - supervised environments (launchd/systemd): caller should exit and let supervisor restart
 * - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
 * - otherwise: spawn detached child with current argv/execArgv, then caller exits
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function restartGatewayProcessWithFreshPid(): GatewayRespawnResult {
  if (isTruthy(process.env.OPENCLAW_NO_RESPAWN)) {
    return { mode: "disabled" };
  }
  if (isLikelySupervisedProcess(process.env)) {
    return { mode: "supervised" };
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const args = [...process.execArgv, ...process.argv.slice(1)];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const child = spawn(process.execPath, args, {
      env: process.env,
      detached: true,
      stdio: "inherit",
    });
    child.unref();
    return { mode: "spawned", pid: child.pid ?? undefined };
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const detail = err instanceof Error ? err.message : String(err);
    return { mode: "failed", detail };
  }
}
