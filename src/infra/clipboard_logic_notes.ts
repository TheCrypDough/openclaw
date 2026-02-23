/*
 * AUTO ANNOTATION
 * File: src/infra/clipboard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { runCommandWithTimeout } from "../process/exec.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function copyToClipboard(value: string): Promise<boolean> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const attempts: Array<{ argv: string[] }> = [
    { argv: ["pbcopy"] },
    { argv: ["xclip", "-selection", "clipboard"] },
    { argv: ["wl-copy"] },
    { argv: ["clip.exe"] }, // WSL / Windows
    { argv: ["powershell", "-NoProfile", "-Command", "Set-Clipboard"] },
  ];
  for (const attempt of attempts) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = await runCommandWithTimeout(attempt.argv, {
        timeoutMs: 3_000,
        input: value,
      });
      if (result.code === 0 && !result.killed) {
        return true;
      }
    } catch {
      // keep trying the next fallback
    }
  }
  return false;
}
