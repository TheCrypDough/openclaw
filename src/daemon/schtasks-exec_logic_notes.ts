/*
 * AUTO ANNOTATION
 * File: src/daemon/schtasks-exec.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execFileUtf8 } from "./exec-file.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function execSchtasks(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  return await execFileUtf8("schtasks", args, { windowsHide: true });
}
