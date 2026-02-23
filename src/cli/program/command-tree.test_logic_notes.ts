/*
 * AUTO ANNOTATION
 * File: src/cli/program/command-tree.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { removeCommand, removeCommandByName } from "./command-tree.js";

describe("command-tree", () => {
  it("removes a command instance when present", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const alpha = program.command("alpha");
    program.command("beta");

    expect(removeCommand(program, alpha)).toBe(true);
    expect(program.commands.map((command) => command.name())).toEqual(["beta"]);
  });

  it("returns false when command instance is already absent", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    program.command("alpha");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const detached = new Command("beta");

    expect(removeCommand(program, detached)).toBe(false);
  });

  it("removes by command name", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    program.command("alpha");
    program.command("beta");

    expect(removeCommandByName(program, "alpha")).toBe(true);
    expect(program.commands.map((command) => command.name())).toEqual(["beta"]);
  });

  it("returns false when name does not exist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    program.command("alpha");

    expect(removeCommandByName(program, "missing")).toBe(false);
    expect(program.commands.map((command) => command.name())).toEqual(["alpha"]);
  });
});
