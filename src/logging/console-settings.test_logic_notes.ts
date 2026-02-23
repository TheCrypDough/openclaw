/*
 * AUTO ANNOTATION
 * File: src/logging/console-settings.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./config.js", () => ({
  readLoggingConfig: () => undefined,
}));

vi.mock("./logger.js", () => ({
  getLogger: () => ({
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {},
  }),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let loadConfigCalls = 0;
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
let originalIsTty: boolean | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let snapshot: ConsoleSnapshot;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let logging: typeof import("../logging.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let state: typeof import("./state.js");

beforeAll(async () => {
  logging = await import("../logging.js");
  state = await import("./state.js");
});

beforeEach(() => {
  loadConfigCalls = 0;
  snapshot = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };
  originalIsTty = process.stdout.isTTY;
  Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
});

afterEach(() => {
  console.log = snapshot.log;
  console.info = snapshot.info;
  console.warn = snapshot.warn;
  console.error = snapshot.error;
  console.debug = snapshot.debug;
  console.trace = snapshot.trace;
  Object.defineProperty(process.stdout, "isTTY", { value: originalIsTty, configurable: true });
  logging.setConsoleConfigLoaderForTests();
  vi.restoreAllMocks();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function loadLogging() {
  state.loggingState.cachedConsoleSettings = null;
  logging.setConsoleConfigLoaderForTests(() => {
    loadConfigCalls += 1;
    if (loadConfigCalls > 5) {
      return {};
    }
    console.error("config load failed");
    return {};
  });
  return { logging, state };
}

describe("getConsoleSettings", () => {
  it("does not recurse when loadConfig logs during resolution", () => {
    const { logging } = loadLogging();
    logging.setConsoleTimestampPrefix(true);
    logging.enableConsoleCapture();
    const { getConsoleSettings } = logging;
    getConsoleSettings();
    expect(loadConfigCalls).toBe(1);
  });

  it("skips config fallback during re-entrant resolution", () => {
    const { logging, state } = loadLogging();
    state.loggingState.resolvingConsoleSettings = true;
    logging.setConsoleTimestampPrefix(true);
    logging.enableConsoleCapture();
    logging.getConsoleSettings();
    expect(loadConfigCalls).toBe(0);
    state.loggingState.resolvingConsoleSettings = false;
  });
});
