/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/json-store.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { safeParseJson } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readJsonFileWithFallback<T>(
  filePath: string,
  fallback: T,
): Promise<{ value: T; exists: boolean }> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.promises.readFile(filePath, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = safeParseJson<T>(raw);
    if (parsed == null) {
      return { value: fallback, exists: true };
    }
    return { value: parsed, exists: true };
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const code = (err as { code?: string }).code;
    if (code === "ENOENT") {
      return { value: fallback, exists: false };
    }
    return { value: fallback, exists: false };
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeJsonFileAtomically(filePath: string, value: unknown): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true, mode: 0o700 });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmp = path.join(dir, `${path.basename(filePath)}.${crypto.randomUUID()}.tmp`);
  await fs.promises.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf-8",
  });
  await fs.promises.chmod(tmp, 0o600);
  await fs.promises.rename(tmp, filePath);
}
