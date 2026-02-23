/*
 * AUTO ANNOTATION
 * File: src/agents/pi-extensions/context-pruning/tools.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { compileGlobPatterns, matchesAnyGlobPattern } from "../../glob-pattern.js";
import type { ContextPruningToolMatch } from "./settings.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeGlob(value: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeToolPrunablePredicate(
  match: ContextPruningToolMatch,
): (toolName: string) => boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deny = compileGlobPatterns({ raw: match.deny, normalize: normalizeGlob });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allow = compileGlobPatterns({ raw: match.allow, normalize: normalizeGlob });

  return (toolName: string) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeGlob(toolName);
    if (matchesAnyGlobPattern(normalized, deny)) {
      return false;
    }
    if (allow.length === 0) {
      return true;
    }
    return matchesAnyGlobPattern(normalized, allow);
  };
}
