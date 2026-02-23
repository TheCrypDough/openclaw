/*
 * AUTO ANNOTATION
 * File: src/daemon/diagnostics.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { resolveGatewayLogPaths } from "./launchd.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const GATEWAY_LOG_ERROR_PATTERNS = [
  /refusing to bind gateway/i,
  /gateway auth mode/i,
  /gateway start blocked/i,
  /failed to bind gateway socket/i,
  /tailscale .* requires/i,
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function readLastLogLine(filePath: string): Promise<string | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(filePath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lines = raw.split(/\r?\n/).map((line) => line.trim());
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      if (lines[i]) {
        return lines[i];
      }
    }
    return null;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readLastGatewayErrorLine(env: NodeJS.ProcessEnv): Promise<string | null> {
  const { stdoutPath, stderrPath } = resolveGatewayLogPaths(env);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stderrRaw = await fs.readFile(stderrPath, "utf8").catch(() => "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdoutRaw = await fs.readFile(stdoutPath, "utf8").catch(() => "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = [...stderrRaw.split(/\r?\n/), ...stdoutRaw.split(/\r?\n/)].map((line) =>
    line.trim(),
  );
  for (let i = lines.length - 1; i >= 0; i -= 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = lines[i];
    if (!line) {
      continue;
    }
    if (GATEWAY_LOG_ERROR_PATTERNS.some((pattern) => pattern.test(line))) {
      return line;
    }
  }
  return (await readLastLogLine(stderrPath)) ?? (await readLastLogLine(stdoutPath));
}
