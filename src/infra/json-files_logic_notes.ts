/*
 * AUTO ANNOTATION
 * File: src/infra/json-files.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeJsonAtomic(
  filePath: string,
  value: unknown,
  options?: { mode?: number },
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = options?.mode ?? 0o600;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmp = `${filePath}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  try {
    await fs.chmod(tmp, mode);
  } catch {
    // best-effort; ignore on platforms without chmod
  }
  await fs.rename(tmp, filePath);
  try {
    await fs.chmod(filePath, mode);
  } catch {
    // best-effort; ignore on platforms without chmod
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createAsyncLock() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let lock: Promise<void> = Promise.resolve();
  return async function withLock<T>(fn: () => Promise<T>): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prev = lock;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let release: (() => void) | undefined;
    lock = new Promise<void>((resolve) => {
      release = resolve;
    });
    await prev;
    try {
      return await fn();
    } finally {
      release?.();
    }
  };
}
