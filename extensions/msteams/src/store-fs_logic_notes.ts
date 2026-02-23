/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/store-fs.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import { readJsonFileWithFallback, writeJsonFileAtomically } from "openclaw/plugin-sdk";
import { withFileLock as withPathLock } from "./file-lock.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STORE_LOCK_OPTIONS = {
  retries: {
    retries: 10,
    factor: 2,
    minTimeout: 100,
    maxTimeout: 10_000,
    randomize: true,
  },
  stale: 30_000,
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readJsonFile<T>(
  filePath: string,
  fallback: T,
): Promise<{ value: T; exists: boolean }> {
  return await readJsonFileWithFallback(filePath, fallback);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeJsonFileAtomically(filePath, value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function ensureJsonFile(filePath: string, fallback: unknown) {
  try {
    await fs.promises.access(filePath);
  } catch {
    await writeJsonFile(filePath, fallback);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withFileLock<T>(
  filePath: string,
  fallback: unknown,
  fn: () => Promise<T>,
): Promise<T> {
  await ensureJsonFile(filePath, fallback);
  return await withPathLock(filePath, STORE_LOCK_OPTIONS, async () => {
    return await fn();
  });
}
