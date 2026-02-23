/*
 * AUTO ANNOTATION
 * File: src/cli/update-cli/restart-helper.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  resolveGatewayLaunchAgentLabel,
  resolveGatewaySystemdServiceName,
  resolveGatewayWindowsTaskName,
} from "../../daemon/constants.js";

/**
 * Shell-escape a string for embedding in single-quoted shell arguments.
 * Replaces every `'` with `'\''` (end quote, escaped quote, resume quote).
 * For batch scripts, validates against special characters instead.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shellEscape(value: string): string {
  return value.replace(/'/g, "'\\''");
}

/** Validates a string is safe for embedding in a batch (cmd.exe) script. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isBatchSafe(value: string): boolean {
  // Reject characters that have special meaning in batch: & | < > ^ % " ` $
  return /^[A-Za-z0-9 _\-().]+$/.test(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveSystemdUnit(env: NodeJS.ProcessEnv): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
  if (override) {
    return override.endsWith(".service") ? override : `${override}.service`;
  }
  return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveLaunchdLabel(env: NodeJS.ProcessEnv): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = env.OPENCLAW_LAUNCHD_LABEL?.trim();
  if (override) {
    return override;
  }
  return resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveWindowsTaskName(env: NodeJS.ProcessEnv): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
  if (override) {
    return override;
  }
  return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}

/**
 * Prepares a standalone script to restart the gateway service.
 * This script is written to a temporary directory and does not depend on
 * the installed package files, ensuring restart capability even if the
 * update process temporarily removes or corrupts installation files.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function prepareRestartScript(
  env: NodeJS.ProcessEnv = process.env,
): Promise<string | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmpDir = os.tmpdir();
  const timestamp = Date.now();
  const platform = process.platform;

  let scriptContent = "";
  let filename = "";

  try {
    if (platform === "linux") {
      const unitName = resolveSystemdUnit(env);
      const escaped = shellEscape(unitName);
      filename = `openclaw-restart-${timestamp}.sh`;
      scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
systemctl --user restart '${escaped}'
# Self-cleanup
rm -f "$0"
`;
    } else if (platform === "darwin") {
      const label = resolveLaunchdLabel(env);
      const escaped = shellEscape(label);
      // Fallback to 501 if getuid is not available (though it should be on macOS)
      const uid = process.getuid ? process.getuid() : 501;
      filename = `openclaw-restart-${timestamp}.sh`;
      scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
launchctl kickstart -k 'gui/${uid}/${escaped}'
# Self-cleanup
rm -f "$0"
`;
    } else if (platform === "win32") {
      const taskName = resolveWindowsTaskName(env);
      if (!isBatchSafe(taskName)) {
        return null;
      }
      filename = `openclaw-restart-${timestamp}.bat`;
      scriptContent = `@echo off
REM Standalone restart script — survives parent process termination.
REM Wait briefly to ensure file locks are released after update.
timeout /t 2 /nobreak >nul
schtasks /End /TN "${taskName}"
schtasks /Run /TN "${taskName}"
REM Self-cleanup
del "%~f0"
`;
    } else {
      return null;
    }

    const scriptPath = path.join(tmpDir, filename);
    await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
    return scriptPath;
  } catch {
    // If we can't write the script, we'll fall back to the standard restart method
    return null;
  }
}

/**
 * Executes the prepared restart script as a **detached** process.
 *
 * The script must outlive the CLI process because the CLI itself is part
 * of the service being restarted — `systemctl restart` / `launchctl
 * kickstart -k` will terminate the current process tree.  Using
 * `spawn({ detached: true })` + `unref()` ensures the script survives
 * the parent's exit.
 *
 * Resolves immediately after spawning; the script runs independently.
 */
export async function runRestartScript(scriptPath: string): Promise<void> {
  const isWindows = process.platform === "win32";
  const file = isWindows ? "cmd.exe" : "/bin/sh";
  const args = isWindows ? ["/c", scriptPath] : [scriptPath];

  const child = spawn(file, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}
