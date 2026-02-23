/*
 * AUTO ANNOTATION
 * File: src/cli/program/build-program.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { registerProgramCommands } from "./command-registry.js";
import { createProgramContext } from "./context.js";
import { configureProgramHelp } from "./help.js";
import { registerPreActionHooks } from "./preaction.js";
import { setProgramContext } from "./program-context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildProgram() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const program = new Command();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx = createProgramContext();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const argv = process.argv;

  setProgramContext(program, ctx);
  configureProgramHelp(program, ctx);
  registerPreActionHooks(program, ctx.programVersion);

  registerProgramCommands(program, ctx, argv);

  return program;
}
