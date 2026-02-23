/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/temp-path.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function sanitizePrefix(prefix: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = prefix.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "tmp";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function sanitizeExtension(extension?: string): string {
  if (!extension) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = extension.startsWith(".") ? extension : `.${extension}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = normalized.match(/[a-zA-Z0-9._-]+$/)?.[0] ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = suffix.replace(/^[._-]+/, "");
  if (!token) {
    return "";
  }
  return `.${token}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function sanitizeFileName(fileName: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = base.replace(/^-+|-+$/g, "");
  return normalized || "download.bin";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildRandomTempFilePath(params: {
  prefix: string;
  extension?: string;
  tmpDir?: string;
  now?: number;
  uuid?: string;
}): string {
  const prefix = sanitizePrefix(params.prefix);
  const extension = sanitizeExtension(params.extension);
  const nowCandidate = params.now;
  const now =
    typeof nowCandidate === "number" && Number.isFinite(nowCandidate)
      ? Math.trunc(nowCandidate)
      : Date.now();
  const uuid = params.uuid?.trim() || crypto.randomUUID();
  return path.join(params.tmpDir ?? os.tmpdir(), `${prefix}-${now}-${uuid}${extension}`);
}

export async function withTempDownloadPath<T>(
  params: {
    prefix: string;
    fileName?: string;
    tmpDir?: string;
  },
  fn: (tmpPath: string) => Promise<T>,
): Promise<T> {
  const tempRoot = params.tmpDir ?? os.tmpdir();
  const prefix = `${sanitizePrefix(params.prefix)}-`;
  const dir = await mkdtemp(path.join(tempRoot, prefix));
  const tmpPath = path.join(dir, sanitizeFileName(params.fileName ?? "download.bin"));
  try {
    return await fn(tmpPath);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
