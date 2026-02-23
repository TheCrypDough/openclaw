/*
 * AUTO ANNOTATION
 * File: src/infra/voicewake.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { createAsyncLock, readJsonFile, writeJsonAtomic } from "./json-files.js";

export type VoiceWakeConfig = {
  triggers: string[];
  updatedAtMs: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TRIGGERS = ["openclaw", "claude", "computer"];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePath(baseDir?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = baseDir ?? resolveStateDir();
  return path.join(root, "settings", "voicewake.json");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function sanitizeTriggers(triggers: string[] | undefined | null): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = (triggers ?? [])
    .map((w) => (typeof w === "string" ? w.trim() : ""))
    .filter((w) => w.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const withLock = createAsyncLock();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function defaultVoiceWakeTriggers() {
  return [...DEFAULT_TRIGGERS];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadVoiceWakeConfig(baseDir?: string): Promise<VoiceWakeConfig> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = resolvePath(baseDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = await readJsonFile<VoiceWakeConfig>(filePath);
  if (!existing) {
    return { triggers: defaultVoiceWakeTriggers(), updatedAtMs: 0 };
  }
  return {
    triggers: sanitizeTriggers(existing.triggers),
    updatedAtMs:
      typeof existing.updatedAtMs === "number" && existing.updatedAtMs > 0
        ? existing.updatedAtMs
        : 0,
  };
}

export async function setVoiceWakeTriggers(
  triggers: string[],
  baseDir?: string,
): Promise<VoiceWakeConfig> {
  const sanitized = sanitizeTriggers(triggers);
  const filePath = resolvePath(baseDir);
  return await withLock(async () => {
    const next: VoiceWakeConfig = {
      triggers: sanitized,
      updatedAtMs: Date.now(),
    };
    await writeJsonAtomic(filePath, next);
    return next;
  });
}
