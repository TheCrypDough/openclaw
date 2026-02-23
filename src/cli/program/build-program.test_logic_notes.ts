/*
 * AUTO ANNOTATION
 * File: src/cli/program/build-program.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import process from "node:process";
import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProgramContext } from "./context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerProgramCommandsMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createProgramContextMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const configureProgramHelpMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerPreActionHooksMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const setProgramContextMock = vi.fn();

vi.mock("./command-registry.js", () => ({
  registerProgramCommands: registerProgramCommandsMock,
}));

vi.mock("./context.js", () => ({
  createProgramContext: createProgramContextMock,
}));

vi.mock("./help.js", () => ({
  configureProgramHelp: configureProgramHelpMock,
}));

vi.mock("./preaction.js", () => ({
  registerPreActionHooks: registerPreActionHooksMock,
}));

vi.mock("./program-context.js", () => ({
  setProgramContext: setProgramContextMock,
}));

const { buildProgram } = await import("./build-program.js");

describe("buildProgram", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createProgramContextMock.mockReturnValue({
      programVersion: "9.9.9-test",
      channelOptions: ["telegram"],
      messageChannelOptions: "telegram",
      agentChannelOptions: "last|telegram",
    } satisfies ProgramContext);
  });

  it("wires context/help/preaction/command registration with shared context", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const argv = ["node", "openclaw", "status"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const originalArgv = process.argv;
    process.argv = argv;
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const program = buildProgram();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const ctx = createProgramContextMock.mock.results[0]?.value as ProgramContext;

      expect(program).toBeInstanceOf(Command);
      expect(setProgramContextMock).toHaveBeenCalledWith(program, ctx);
      expect(configureProgramHelpMock).toHaveBeenCalledWith(program, ctx);
      expect(registerPreActionHooksMock).toHaveBeenCalledWith(program, ctx.programVersion);
      expect(registerProgramCommandsMock).toHaveBeenCalledWith(program, ctx, argv);
    } finally {
      process.argv = originalArgv;
    }
  });
});
