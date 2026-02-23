/*
 * AUTO ANNOTATION
 * File: src/cli/program/action-reparse.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { buildParseArgv } from "../argv.js";
import { resolveActionArgs } from "./helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function reparseProgramFromActionArgs(
  program: Command,
  actionArgs: unknown[],
): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actionCommand = actionArgs.at(-1) as Command | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = actionCommand?.parent ?? program;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawArgs = (root as Command & { rawArgs?: string[] }).rawArgs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actionArgsList = resolveActionArgs(actionCommand);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallbackArgv = actionCommand?.name()
    ? [actionCommand.name(), ...actionArgsList]
    : actionArgsList;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parseArgv = buildParseArgv({
    programName: program.name(),
    rawArgs,
    fallbackArgv,
  });
  await program.parseAsync(parseArgv);
}
