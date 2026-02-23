/*
 * AUTO ANNOTATION
 * File: src/cli/parse-bytes.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type BytesParseOptions = {
  defaultUnit?: "b" | "kb" | "mb" | "gb" | "tb";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const UNIT_MULTIPLIERS: Record<string, number> = {
  b: 1,
  kb: 1024,
  k: 1024,
  mb: 1024 ** 2,
  m: 1024 ** 2,
  gb: 1024 ** 3,
  g: 1024 ** 3,
  tb: 1024 ** 4,
  t: 1024 ** 4,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseByteSize(raw: string, opts?: BytesParseOptions): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!trimmed) {
    throw new Error("invalid byte size (empty)");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const m = /^(\d+(?:\.\d+)?)([a-z]+)?$/.exec(trimmed);
  if (!m) {
    throw new Error(`invalid byte size: ${raw}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`invalid byte size: ${raw}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unit = (m[2] ?? opts?.defaultUnit ?? "b").toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const multiplier = UNIT_MULTIPLIERS[unit];
  if (!multiplier) {
    throw new Error(`invalid byte size unit: ${raw}`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const bytes = Math.round(value * multiplier);
  if (!Number.isFinite(bytes)) {
    throw new Error(`invalid byte size: ${raw}`);
  }
  return bytes;
}
