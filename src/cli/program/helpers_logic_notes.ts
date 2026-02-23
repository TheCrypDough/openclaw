/*
 * AUTO ANNOTATION
 * File: src/cli/program/helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectOption(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parsePositiveIntOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = Math.trunc(value);
    return parsed > 0 ? parsed : undefined;
  }
  if (typeof value === "string") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return undefined;
    }
    return parsed;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveActionArgs(actionCommand?: import("commander").Command): string[] {
  if (!actionCommand) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = (actionCommand as import("commander").Command & { args?: string[] }).args;
  return Array.isArray(args) ? args : [];
}
