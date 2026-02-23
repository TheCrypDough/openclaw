/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/debug-commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";

export type DebugCommand =
  | { action: "show" }
  | { action: "reset" }
  | { action: "set"; path: string; value: unknown }
  | { action: "unset"; path: string }
  | { action: "error"; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseDebugCommand(raw: string): DebugCommand | null {
  return parseStandardSetUnsetSlashCommand<DebugCommand>({
    raw,
    slash: "/debug",
    invalidMessage: "Invalid /debug syntax.",
    usageMessage: "Usage: /debug show|set|unset|reset",
    onKnownAction: (action) => {
      if (action === "show") {
        return { action: "show" };
      }
      if (action === "reset") {
        return { action: "reset" };
      }
      return undefined;
    },
  });
}
