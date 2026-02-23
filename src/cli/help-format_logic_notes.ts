/*
 * AUTO ANNOTATION
 * File: src/cli/help-format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { theme } from "../terminal/theme.js";

export type HelpExample = readonly [command: string, description: string];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatHelpExample(command: string, description: string): string {
  return `  ${theme.command(command)}\n    ${theme.muted(description)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatHelpExampleLine(command: string, description: string): string {
  if (!description) {
    return `  ${theme.command(command)}`;
  }
  return `  ${theme.command(command)} ${theme.muted(`# ${description}`)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatHelpExamples(examples: ReadonlyArray<HelpExample>, inline = false): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatter = inline ? formatHelpExampleLine : formatHelpExample;
  return examples.map(([command, description]) => formatter(command, description)).join("\n");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatHelpExampleGroup(
  label: string,
  examples: ReadonlyArray<HelpExample>,
  inline = false,
) {
  return `${theme.muted(label)}\n${formatHelpExamples(examples, inline)}`;
}
