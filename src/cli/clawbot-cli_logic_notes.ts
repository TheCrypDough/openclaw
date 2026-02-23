/*
 * AUTO ANNOTATION
 * File: src/cli/clawbot-cli.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { registerQrCli } from "./qr-cli.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerClawbotCli(program: Command) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const clawbot = program.command("clawbot").description("Legacy clawbot command aliases");
  registerQrCli(clawbot);
}
