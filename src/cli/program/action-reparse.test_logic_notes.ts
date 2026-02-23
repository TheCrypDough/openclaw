/*
 * AUTO ANNOTATION
 * File: src/cli/program/action-reparse.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const buildParseArgvMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveActionArgsMock = vi.fn();

vi.mock("../argv.js", () => ({
  buildParseArgv: buildParseArgvMock,
}));

vi.mock("./helpers.js", () => ({
  resolveActionArgs: resolveActionArgsMock,
}));

const { reparseProgramFromActionArgs } = await import("./action-reparse.js");

describe("reparseProgramFromActionArgs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildParseArgvMock.mockReturnValue(["node", "openclaw", "status"]);
    resolveActionArgsMock.mockReturnValue([]);
  });

  it("uses action command name + args as fallback argv", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command().name("openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actionCommand = {
      name: () => "status",
      parent: {
        rawArgs: ["node", "openclaw", "status", "--json"],
      },
    } as unknown as Command;
    resolveActionArgsMock.mockReturnValue(["--json"]);

    await reparseProgramFromActionArgs(program, [actionCommand]);

    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openclaw",
      rawArgs: ["node", "openclaw", "status", "--json"],
      fallbackArgv: ["status", "--json"],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openclaw", "status"]);
  });

  it("falls back to action args without command name when action has no name", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command().name("openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actionCommand = {
      name: () => "",
      parent: {},
    } as unknown as Command;
    resolveActionArgsMock.mockReturnValue(["--json"]);

    await reparseProgramFromActionArgs(program, [actionCommand]);

    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openclaw",
      rawArgs: undefined,
      fallbackArgv: ["--json"],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openclaw", "status"]);
  });

  it("uses program root when action command is missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command().name("openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parseAsync = vi.spyOn(program, "parseAsync").mockResolvedValue(program);

    await reparseProgramFromActionArgs(program, []);

    expect(resolveActionArgsMock).toHaveBeenCalledWith(undefined);
    expect(buildParseArgvMock).toHaveBeenCalledWith({
      programName: "openclaw",
      rawArgs: [],
      fallbackArgv: [],
    });
    expect(parseAsync).toHaveBeenCalledWith(["node", "openclaw", "status"]);
  });
});
