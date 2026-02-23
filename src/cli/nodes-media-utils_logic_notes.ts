/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-media-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTempPathParts(opts: { ext: string; tmpDir?: string; id?: string }): {
  ext: string;
  tmpDir: string;
  id: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmpDir = opts.tmpDir ?? resolvePreferredOpenClawTmpDir();
  if (!opts.tmpDir) {
    fs.mkdirSync(tmpDir, { recursive: true, mode: 0o700 });
  }
  return {
    tmpDir,
    id: opts.id ?? randomUUID(),
    ext: opts.ext.startsWith(".") ? opts.ext : `.${opts.ext}`,
  };
}
