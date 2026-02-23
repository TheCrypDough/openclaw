/*
 * AUTO ANNOTATION
 * File: src/cli/command-options.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasExplicitOptions(command: Command, names: readonly string[]): boolean {
  if (typeof command.getOptionValueSource !== "function") {
    return false;
  }
  return names.some((name) => command.getOptionValueSource(name) === "cli");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getOptionSource(command: Command, name: string): string | undefined {
  if (typeof command.getOptionValueSource !== "function") {
    return undefined;
  }
  return command.getOptionValueSource(name);
}

// Defensive guardrail: allow expected parent/grandparent inheritance without unbounded deep traversal.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_INHERIT_DEPTH = 2;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function inheritOptionFromParent<T = unknown>(
  command: Command | undefined,
  name: string,
): T | undefined {
  if (!command) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const childSource = getOptionSource(command, name);
  if (childSource && childSource !== "default") {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let depth = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let ancestor = command.parent;
  while (ancestor && depth < MAX_INHERIT_DEPTH) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const source = getOptionSource(ancestor, name);
    if (source && source !== "default") {
      return ancestor.opts<Record<string, unknown>>()[name] as T | undefined;
    }
    depth += 1;
    ancestor = ancestor.parent;
  }
  return undefined;
}
