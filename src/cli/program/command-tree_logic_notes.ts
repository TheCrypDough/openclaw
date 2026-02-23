/*
 * AUTO ANNOTATION
 * File: src/cli/program/command-tree.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function removeCommand(program: Command, command: Command): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commands = program.commands as Command[];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const index = commands.indexOf(command);
  if (index < 0) {
    return false;
  }
  commands.splice(index, 1);
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function removeCommandByName(program: Command, name: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = program.commands.find((command) => command.name() === name);
  if (!existing) {
    return false;
  }
  return removeCommand(program, existing);
}
