/*
 * AUTO ANNOTATION
 * File: src/terminal/restore.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { clearActiveProgressLine } from "./progress-line.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RESET_SEQUENCE = "\x1b[0m\x1b[?25h\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l\x1b[?2004l";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RestoreTerminalStateOptions = {
  /**
   * Resumes paused stdin after restoring terminal mode.
   * Keep this off when the process should exit immediately after cleanup.
   *
   * Default: false (safer for "cleanup then exit" call sites).
   */
  resumeStdin?: boolean;

  /**
   * Alias for resumeStdin. Prefer this name to make the behavior explicit.
   *
   * Default: false.
   */
  resumeStdinIfPaused?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function reportRestoreFailure(scope: string, err: unknown, reason?: string): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = reason ? ` (${reason})` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
  try {
    process.stderr.write(`${message}\n`);
  } catch (writeErr) {
    console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function restoreTerminalState(
  reason?: string,
  options: RestoreTerminalStateOptions = {},
): void {
  // Docker TTY note: resuming stdin can keep a container process alive even
  // after the wizard is "done" (stdin_open: true), making installers appear hung.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
  try {
    clearActiveProgressLine();
  } catch (err) {
    reportRestoreFailure("progress line", err, reason);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdin = process.stdin;
  if (stdin.isTTY && typeof stdin.setRawMode === "function") {
    try {
      stdin.setRawMode(false);
    } catch (err) {
      reportRestoreFailure("raw mode", err, reason);
    }
    if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) {
      try {
        stdin.resume();
      } catch (err) {
        reportRestoreFailure("stdin resume", err, reason);
      }
    }
  }

  if (process.stdout.isTTY) {
    try {
      process.stdout.write(RESET_SEQUENCE);
    } catch (err) {
      reportRestoreFailure("stdout reset", err, reason);
    }
  }
}
