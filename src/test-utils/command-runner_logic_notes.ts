/*
 * AUTO ANNOTATION
 * File: src/test-utils/command-runner.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runRegisteredCli(params: {
  register: (program: Command) => void;
  argv: string[];
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const program = new Command();
  params.register(program);
  await program.parseAsync(params.argv, { from: "user" });
}
