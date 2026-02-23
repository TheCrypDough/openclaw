/*
 * AUTO ANNOTATION
 * File: src/daemon/output.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { colorize, isRich, theme } from "../terminal/theme.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const toPosixPath = (value: string) => value.replace(/\\/g, "/");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLine(label: string, value: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rich = isRich();
  return `${colorize(rich, theme.muted, `${label}:`)} ${colorize(rich, theme.command, value)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function writeFormattedLines(
  stdout: NodeJS.WritableStream,
  lines: Array<{ label: string; value: string }>,
  opts?: { leadingBlankLine?: boolean },
): void {
  if (opts?.leadingBlankLine) {
    stdout.write("\n");
  }
  for (const line of lines) {
    stdout.write(`${formatLine(line.label, line.value)}\n`);
  }
}
