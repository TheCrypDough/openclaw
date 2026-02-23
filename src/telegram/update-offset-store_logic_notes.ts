/*
 * AUTO ANNOTATION
 * File: src/telegram/update-offset-store.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STORE_VERSION = 1;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TelegramUpdateOffsetState = {
  version: number;
  lastUpdateId: number | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAccountId(accountId?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = accountId?.trim();
  if (!trimmed) {
    return "default";
  }
  return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTelegramUpdateOffsetPath(
  accountId?: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = resolveStateDir(env, os.homedir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeAccountId(accountId);
  return path.join(stateDir, "telegram", `update-offset-${normalized}.json`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function safeParseState(raw: string): TelegramUpdateOffsetState | null {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as TelegramUpdateOffsetState;
    if (parsed?.version !== STORE_VERSION) {
      return null;
    }
    if (parsed.lastUpdateId !== null && typeof parsed.lastUpdateId !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readTelegramUpdateOffset(params: {
  accountId?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<number | null> {
  const filePath = resolveTelegramUpdateOffsetPath(params.accountId, params.env);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = safeParseState(raw);
    return parsed?.lastUpdateId ?? null;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "ENOENT") {
      return null;
    }
    return null;
  }
}

export async function writeTelegramUpdateOffset(params: {
  accountId?: string;
  updateId: number;
  env?: NodeJS.ProcessEnv;
}): Promise<void> {
  const filePath = resolveTelegramUpdateOffsetPath(params.accountId, params.env);
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const tmp = path.join(dir, `${path.basename(filePath)}.${crypto.randomUUID()}.tmp`);
  const payload: TelegramUpdateOffsetState = {
    version: STORE_VERSION,
    lastUpdateId: params.updateId,
  };
  await fs.writeFile(tmp, `${JSON.stringify(payload, null, 2)}\n`, {
    encoding: "utf-8",
  });
  await fs.chmod(tmp, 0o600);
  await fs.rename(tmp, filePath);
}

export async function deleteTelegramUpdateOffset(params: {
  accountId?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<void> {
  const filePath = resolveTelegramUpdateOffsetPath(params.accountId, params.env);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "ENOENT") {
      return;
    }
    throw err;
  }
}
