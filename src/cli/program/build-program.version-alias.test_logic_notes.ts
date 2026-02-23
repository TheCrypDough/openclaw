/*
 * AUTO ANNOTATION
 * File: src/cli/program/build-program.version-alias.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import process from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { buildProgram } = await import("./build-program.js");

describe("buildProgram version alias handling", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  it("exits with version output for root -v", () => {
    process.argv = ["node", "openclaw", "-v"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`process.exit:${String(code)}`);
    }) as typeof process.exit);

    expect(() => buildProgram()).toThrow("process.exit:0");
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("does not treat subcommand -v as root version alias", () => {
    process.argv = ["node", "openclaw", "acp", "-v"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`unexpected process.exit:${String(code)}`);
    }) as typeof process.exit);

    expect(() => buildProgram()).not.toThrow();
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
