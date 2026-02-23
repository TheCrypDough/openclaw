/*
 * AUTO ANNOTATION
 * File: src/terminal/restore.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const clearActiveProgressLine = vi.hoisted(() => vi.fn());

vi.mock("./progress-line.js", () => ({
  clearActiveProgressLine,
}));

import { restoreTerminalState } from "./restore.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function configureTerminalIO(params: {
  stdinIsTTY: boolean;
  stdoutIsTTY: boolean;
  setRawMode?: (mode: boolean) => void;
  resume?: () => void;
  isPaused?: () => boolean;
}) {
  Object.defineProperty(process.stdin, "isTTY", { value: params.stdinIsTTY, configurable: true });
  Object.defineProperty(process.stdout, "isTTY", { value: params.stdoutIsTTY, configurable: true });
  (process.stdin as { setRawMode?: (mode: boolean) => void }).setRawMode = params.setRawMode;
  (process.stdin as { resume?: () => void }).resume = params.resume;
  (process.stdin as { isPaused?: () => boolean }).isPaused = params.isPaused;
}

describe("restoreTerminalState", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalStdinIsTTY = process.stdin.isTTY;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalStdoutIsTTY = process.stdout.isTTY;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalSetRawMode = (process.stdin as { setRawMode?: (mode: boolean) => void }).setRawMode;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalResume = (process.stdin as { resume?: () => void }).resume;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalIsPaused = (process.stdin as { isPaused?: () => boolean }).isPaused;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(process.stdin, "isTTY", {
      value: originalStdinIsTTY,
      configurable: true,
    });
    Object.defineProperty(process.stdout, "isTTY", {
      value: originalStdoutIsTTY,
      configurable: true,
    });
    (process.stdin as { setRawMode?: (mode: boolean) => void }).setRawMode = originalSetRawMode;
    (process.stdin as { resume?: () => void }).resume = originalResume;
    (process.stdin as { isPaused?: () => boolean }).isPaused = originalIsPaused;
  });

  it("does not resume paused stdin by default", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const setRawMode = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resume = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const isPaused = vi.fn(() => true);

    configureTerminalIO({
      stdinIsTTY: true,
      stdoutIsTTY: false,
      setRawMode,
      resume,
      isPaused,
    });

    restoreTerminalState("test");

    expect(setRawMode).toHaveBeenCalledWith(false);
    expect(resume).not.toHaveBeenCalled();
  });

  it("resumes paused stdin when resumeStdin is true", () => {
    const setRawMode = vi.fn();
    const resume = vi.fn();
    const isPaused = vi.fn(() => true);

    configureTerminalIO({
      stdinIsTTY: true,
      stdoutIsTTY: false,
      setRawMode,
      resume,
      isPaused,
    });

    restoreTerminalState("test", { resumeStdinIfPaused: true });

    expect(setRawMode).toHaveBeenCalledWith(false);
    expect(resume).toHaveBeenCalledOnce();
  });

  it("does not touch stdin when stdin is not a TTY", () => {
    const setRawMode = vi.fn();
    const resume = vi.fn();
    const isPaused = vi.fn(() => true);

    configureTerminalIO({
      stdinIsTTY: false,
      stdoutIsTTY: false,
      setRawMode,
      resume,
      isPaused,
    });

    restoreTerminalState("test", { resumeStdinIfPaused: true });

    expect(setRawMode).not.toHaveBeenCalled();
    expect(resume).not.toHaveBeenCalled();
  });
});
