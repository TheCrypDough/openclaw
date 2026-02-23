/*
 * AUTO ANNOTATION
 * File: src/cron/store.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { expandHomePrefix } from "../infra/home-dir.js";
import { CONFIG_DIR } from "../utils.js";
import type { CronStoreFile } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CRON_DIR = path.join(CONFIG_DIR, "cron");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CRON_STORE_PATH = path.join(DEFAULT_CRON_DIR, "jobs.json");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCronStorePath(storePath?: string) {
  if (storePath?.trim()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = storePath.trim();
    if (raw.startsWith("~")) {
      return path.resolve(expandHomePrefix(raw));
    }
    return path.resolve(raw);
  }
  return DEFAULT_CRON_STORE_PATH;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadCronStore(storePath: string): Promise<CronStoreFile> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.promises.readFile(storePath, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let parsed: unknown;
    try {
      parsed = JSON5.parse(raw);
    } catch (err) {
      throw new Error(`Failed to parse cron store at ${storePath}: ${String(err)}`, {
        cause: err,
      });
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsedRecord =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const jobs = Array.isArray(parsedRecord.jobs) ? (parsedRecord.jobs as never[]) : [];
    return {
      version: 1,
      jobs: jobs.filter(Boolean) as never as CronStoreFile["jobs"],
    };
  } catch (err) {
    if ((err as { code?: unknown })?.code === "ENOENT") {
      return { version: 1, jobs: [] };
    }
    throw err;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function saveCronStore(storePath: string, store: CronStoreFile) {
  await fs.promises.mkdir(path.dirname(storePath), { recursive: true });
  const { randomBytes } = await import("node:crypto");
  const tmp = `${storePath}.${process.pid}.${randomBytes(8).toString("hex")}.tmp`;
  const json = JSON.stringify(store, null, 2);
  await fs.promises.writeFile(tmp, json, "utf-8");
  await fs.promises.rename(tmp, storePath);
  try {
    await fs.promises.copyFile(storePath, `${storePath}.bak`);
  } catch {
    // best-effort
  }
}
