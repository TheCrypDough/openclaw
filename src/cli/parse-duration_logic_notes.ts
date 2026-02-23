/*
 * AUTO ANNOTATION
 * File: src/cli/parse-duration.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type DurationMsParseOptions = {
  defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!trimmed) {
    throw new Error("invalid duration (empty)");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const m = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)?$/.exec(trimmed);
  if (!m) {
    throw new Error(`invalid duration: ${raw}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`invalid duration: ${raw}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unit = (m[2] ?? opts?.defaultUnit ?? "ms") as "ms" | "s" | "m" | "h" | "d";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const multiplier =
    unit === "ms"
      ? 1
      : unit === "s"
        ? 1000
        : unit === "m"
          ? 60_000
          : unit === "h"
            ? 3_600_000
            : 86_400_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ms = Math.round(value * multiplier);
  if (!Number.isFinite(ms)) {
    throw new Error(`invalid duration: ${raw}`);
  }
  return ms;
}
