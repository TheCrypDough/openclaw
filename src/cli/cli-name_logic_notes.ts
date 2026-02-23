/*
 * AUTO ANNOTATION
 * File: src/cli/cli-name.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CLI_NAME = "openclaw";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const KNOWN_CLI_NAMES = new Set([DEFAULT_CLI_NAME]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CLI_PREFIX_RE = /^(?:((?:pnpm|npm|bunx|npx)\s+))?(openclaw)\b/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCliName(argv: string[] = process.argv): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const argv1 = argv[1];
  if (!argv1) {
    return DEFAULT_CLI_NAME;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = path.basename(argv1).trim();
  if (KNOWN_CLI_NAMES.has(base)) {
    return base;
  }
  return DEFAULT_CLI_NAME;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function replaceCliName(command: string, cliName = resolveCliName()): string {
  if (!command.trim()) {
    return command;
  }
  if (!CLI_PREFIX_RE.test(command)) {
    return command;
  }
  return command.replace(CLI_PREFIX_RE, (_match, runner: string | undefined) => {
    return `${runner ?? ""}${cliName}`;
  });
}
