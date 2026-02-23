/*
 * AUTO ANNOTATION
 * File: src/logging/console-capture.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enableConsoleCapture,
  resetLogger,
  routeLogsToStderr,
  setConsoleTimestampPrefix,
  setLoggerOverride,
} from "../logging.js";
import { loggingState } from "./state.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ConsoleSnapshot = {
  log: typeof console.log;
  info: typeof console.info;
  warn: typeof console.warn;
  error: typeof console.error;
  debug: typeof console.debug;
  trace: typeof console.trace;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let snapshot: ConsoleSnapshot;

beforeEach(() => {
  snapshot = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };
  loggingState.consolePatched = false;
  loggingState.forceConsoleToStderr = false;
  loggingState.consoleTimestampPrefix = false;
  loggingState.rawConsole = null;
  resetLogger();
});

afterEach(() => {
  console.log = snapshot.log;
  console.info = snapshot.info;
  console.warn = snapshot.warn;
  console.error = snapshot.error;
  console.debug = snapshot.debug;
  console.trace = snapshot.trace;
  loggingState.consolePatched = false;
  loggingState.forceConsoleToStderr = false;
  loggingState.consoleTimestampPrefix = false;
  loggingState.rawConsole = null;
  resetLogger();
  setLoggerOverride(null);
  vi.restoreAllMocks();
});

describe("enableConsoleCapture", () => {
  it("swallows EIO from stderr writes", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
    vi.spyOn(process.stderr, "write").mockImplementation(() => {
      throw eioError();
    });
    routeLogsToStderr();
    enableConsoleCapture();
    expect(() => console.log("hello")).not.toThrow();
  });

  it("swallows EIO from original console writes", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
    console.log = () => {
      throw eioError();
    };
    enableConsoleCapture();
    expect(() => console.log("hello")).not.toThrow();
  });

  it("prefixes console output with timestamps when enabled", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const now = new Date("2026-01-17T18:01:02.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
    console.warn = warn;
    setConsoleTimestampPrefix(true);
    enableConsoleCapture();
    console.warn("[EventQueue] Slow listener detected");
    expect(warn).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const firstArg = String(warn.mock.calls[0]?.[0] ?? "");
    // Timestamp uses local time with timezone offset instead of UTC "Z" suffix
    expect(firstArg).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2} \[EventQueue\]/,
    );
    vi.useRealTimers();
  });

  it("suppresses discord EventQueue slow listener duplicates", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
    console.warn = warn;
    enableConsoleCapture();
    console.warn(
      "[EventQueue] Slow listener detected: DiscordMessageListener took 12.3 seconds for event MESSAGE_CREATE",
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not double-prefix timestamps", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
    console.warn = warn;
    setConsoleTimestampPrefix(true);
    enableConsoleCapture();
    console.warn("12:34:56 [exec] hello");
    expect(warn).toHaveBeenCalledWith("12:34:56 [exec] hello");
  });

  it("leaves JSON output unchanged when timestamp prefix is enabled", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const log = vi.fn();
    console.log = log;
    setConsoleTimestampPrefix(true);
    enableConsoleCapture();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload = JSON.stringify({ ok: true });
    console.log(payload);
    expect(log).toHaveBeenCalledWith(payload);
  });

  it.each([
    { name: "stdout", stream: process.stdout },
    { name: "stderr", stream: process.stderr },
  ])("swallows async EPIPE on $name", ({ stream }) => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
    enableConsoleCapture();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const epipe = new Error("write EPIPE") as NodeJS.ErrnoException;
    epipe.code = "EPIPE";
    expect(() => stream.emit("error", epipe)).not.toThrow();
  });

  it("rethrows non-EPIPE errors on stdout", () => {
    setLoggerOverride({ level: "info", file: tempLogPath() });
    enableConsoleCapture();
    const other = new Error("EACCES") as NodeJS.ErrnoException;
    other.code = "EACCES";
    expect(() => process.stdout.emit("error", other)).toThrow("EACCES");
  });
});

function tempLogPath() {
  return path.join(os.tmpdir(), `openclaw-log-${crypto.randomUUID()}.log`);
}

function eioError() {
  const err = new Error("EIO") as NodeJS.ErrnoException;
  err.code = "EIO";
  return err;
}
