/*
 * AUTO ANNOTATION
 * File: src/terminal/ansi.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ANSI_SGR_PATTERN = "\\x1b\\[[0-9;]*m";
// OSC-8 hyperlinks: ESC ] 8 ; ; url ST ... ESC ] 8 ; ; ST
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OSC8_PATTERN = "\\x1b\\]8;;.*?\\x1b\\\\|\\x1b\\]8;;\\x1b\\\\";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ANSI_REGEX = new RegExp(ANSI_SGR_PATTERN, "g");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OSC8_REGEX = new RegExp(OSC8_PATTERN, "g");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripAnsi(input: string): string {
  return input.replace(OSC8_REGEX, "").replace(ANSI_REGEX, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function visibleWidth(input: string): number {
  return Array.from(stripAnsi(input)).length;
}
