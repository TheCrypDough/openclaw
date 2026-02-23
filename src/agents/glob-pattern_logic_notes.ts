/*
 * AUTO ANNOTATION
 * File: src/agents/glob-pattern.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type CompiledGlobPattern =
  | { kind: "all" }
  | { kind: "exact"; value: string }
  | { kind: "regex"; value: RegExp };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function escapeRegex(value: string) {
  // Standard "escape string for regex literal" pattern.
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function compileGlobPattern(params: {
  raw: string;
  normalize: (value: string) => string;
}): CompiledGlobPattern {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = params.normalize(params.raw);
  if (!normalized) {
    return { kind: "exact", value: "" };
  }
  if (normalized === "*") {
    return { kind: "all" };
  }
  if (!normalized.includes("*")) {
    return { kind: "exact", value: normalized };
  }
  return {
    kind: "regex",
    value: new RegExp(`^${escapeRegex(normalized).replaceAll("\\*", ".*")}$`),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function compileGlobPatterns(params: {
  raw?: string[] | undefined;
  normalize: (value: string) => string;
}): CompiledGlobPattern[] {
  if (!Array.isArray(params.raw)) {
    return [];
  }
  return params.raw
    .map((raw) => compileGlobPattern({ raw, normalize: params.normalize }))
    .filter((pattern) => pattern.kind !== "exact" || pattern.value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function matchesAnyGlobPattern(value: string, patterns: CompiledGlobPattern[]): boolean {
  for (const pattern of patterns) {
    if (pattern.kind === "all") {
      return true;
    }
    if (pattern.kind === "exact" && value === pattern.value) {
      return true;
    }
    if (pattern.kind === "regex" && pattern.value.test(value)) {
      return true;
    }
  }
  return false;
}
