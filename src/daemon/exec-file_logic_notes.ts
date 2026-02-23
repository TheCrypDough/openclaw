/*
 * AUTO ANNOTATION
 * File: src/daemon/exec-file.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execFile, type ExecFileOptionsWithStringEncoding } from "node:child_process";

export type ExecResult = { stdout: string; stderr: string; code: number };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function execFileUtf8(
  command: string,
  args: string[],
  options: Omit<ExecFileOptionsWithStringEncoding, "encoding"> = {},
): Promise<ExecResult> {
  return await new Promise<ExecResult>((resolve) => {
    execFile(command, args, { ...options, encoding: "utf8" }, (error, stdout, stderr) => {
      if (!error) {
        resolve({
          stdout: String(stdout ?? ""),
          stderr: String(stderr ?? ""),
          code: 0,
        });
        return;
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const e = error as { code?: unknown; message?: unknown };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stderrText = String(stderr ?? "");
      resolve({
        stdout: String(stdout ?? ""),
        stderr:
          stderrText ||
          (typeof e.message === "string" ? e.message : typeof error === "string" ? error : ""),
        code: typeof e.code === "number" ? e.code : 1,
      });
    });
  });
}
