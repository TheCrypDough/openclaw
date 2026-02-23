/*
 * AUTO ANNOTATION
 * File: src/cli/command-format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { replaceCliName, resolveCliName } from "./cli-name.js";
import { normalizeProfileName } from "./profile-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatCliCommand(
  command: string,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cliName = resolveCliName();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedCommand = replaceCliName(command, cliName);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
  if (!profile) {
    return normalizedCommand;
  }
  if (!CLI_PREFIX_RE.test(normalizedCommand)) {
    return normalizedCommand;
  }
  if (PROFILE_FLAG_RE.test(normalizedCommand) || DEV_FLAG_RE.test(normalizedCommand)) {
    return normalizedCommand;
  }
  return normalizedCommand.replace(CLI_PREFIX_RE, (match) => `${match} --profile ${profile}`);
}
