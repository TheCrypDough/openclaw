# AUTOPLACEHOLDER_ANNOTATION: src/auto-reply/reply/config-commands.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";

export type ConfigCommand =
  | { action: "show"; path?: string }
  | { action: "set"; path: string; value: unknown }
  | { action: "unset"; path: string }
  | { action: "error"; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseConfigCommand(raw: string): ConfigCommand | null {
  return parseStandardSetUnsetSlashCommand<ConfigCommand>({
    raw,
    slash: "/config",
    invalidMessage: "Invalid /config syntax.",
    usageMessage: "Usage: /config show|set|unset",
    onKnownAction: (action, args) => {
      if (action === "show" || action === "get") {
        return { action: "show", path: args || undefined };
      }
      return undefined;
    },
  });
}
