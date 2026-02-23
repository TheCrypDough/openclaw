/*
 * AUTO ANNOTATION
 * File: src/agents/skills-install-download.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import {
  isWindowsDrivePath,
  resolveArchiveOutputPath,
  stripArchivePath,
  validateArchiveEntryPath,
} from "../infra/archive-path.js";
import { extractArchive as extractArchiveSafe } from "../infra/archive.js";
import { fetchWithSsrFGuard } from "../infra/net/fetch-guard.js";
import { isWithinDir } from "../infra/path-safety.js";
import { runCommandWithTimeout } from "../process/exec.js";
import { ensureDir, resolveUserPath } from "../utils.js";
import { formatInstallFailureMessage } from "./skills-install-output.js";
import type { SkillInstallResult } from "./skills-install.js";
import type { SkillEntry, SkillInstallSpec } from "./skills.js";
import { hasBinary } from "./skills.js";
import { resolveSkillToolsRootDir } from "./skills/tools-dir.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isNodeReadableStream(value: unknown): value is NodeJS.ReadableStream {
  return Boolean(value && typeof (value as NodeJS.ReadableStream).pipe === "function");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveDownloadTargetDir(entry: SkillEntry, spec: SkillInstallSpec): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeRoot = resolveSkillToolsRootDir(entry);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = spec.targetDir?.trim();
  if (!raw) {
    return safeRoot;
  }

  // Treat non-absolute paths as relative to the per-skill tools root.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved =
    raw.startsWith("~") || path.isAbsolute(raw) || isWindowsDrivePath(raw)
      ? resolveUserPath(raw)
      : path.resolve(safeRoot, raw);

  if (!isWithinDir(safeRoot, resolved)) {
    throw new Error(
      `Refusing to install outside the skill tools directory. targetDir="${raw}" resolves to "${resolved}". Allowed root: "${safeRoot}".`,
    );
  }
  return resolved;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveArchiveType(spec: SkillInstallSpec, filename: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit = spec.archive?.trim().toLowerCase();
  if (explicit) {
    return explicit;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = filename.toLowerCase();
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
    return "tar.gz";
  }
  if (lower.endsWith(".tar.bz2") || lower.endsWith(".tbz2")) {
    return "tar.bz2";
  }
  if (lower.endsWith(".zip")) {
    return "zip";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function downloadFile(
  url: string,
  destPath: string,
  timeoutMs: number,
): Promise<{ bytes: number }> {
  const { response, release } = await fetchWithSsrFGuard({
    url,
    timeoutMs: Math.max(1_000, timeoutMs),
  });
  try {
    if (!response.ok || !response.body) {
      throw new Error(`Download failed (${response.status} ${response.statusText})`);
    }
    await ensureDir(path.dirname(destPath));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = fs.createWriteStream(destPath);
    const body = response.body as unknown;
    const readable = isNodeReadableStream(body)
      ? body
      : Readable.fromWeb(body as NodeReadableStream);
    await pipeline(readable, file);
    const stat = await fs.promises.stat(destPath);
    return { bytes: stat.size };
  } finally {
    await release();
  }
}

async function extractArchive(params: {
  archivePath: string;
  archiveType: string;
  targetDir: string;
  stripComponents?: number;
  timeoutMs: number;
}): Promise<{ stdout: string; stderr: string; code: number | null }> {
  const { archivePath, archiveType, targetDir, stripComponents, timeoutMs } = params;
  const strip =
    typeof stripComponents === "number" && Number.isFinite(stripComponents)
      ? Math.max(0, Math.floor(stripComponents))
      : 0;

  try {
    if (archiveType === "zip") {
      await extractArchiveSafe({
        archivePath,
        destDir: targetDir,
        timeoutMs,
        kind: "zip",
        stripComponents: strip,
      });
      return { stdout: "", stderr: "", code: 0 };
    }

    if (archiveType === "tar.gz") {
      await extractArchiveSafe({
        archivePath,
        destDir: targetDir,
        timeoutMs,
        kind: "tar",
        stripComponents: strip,
        tarGzip: true,
      });
      return { stdout: "", stderr: "", code: 0 };
    }

    if (archiveType === "tar.bz2") {
      if (!hasBinary("tar")) {
        return { stdout: "", stderr: "tar not found on PATH", code: null };
      }

      // Preflight list to prevent zip-slip style traversal before extraction.
      const listResult = await runCommandWithTimeout(["tar", "tf", archivePath], { timeoutMs });
      if (listResult.code !== 0) {
        return {
          stdout: listResult.stdout,
          stderr: listResult.stderr || "tar list failed",
          code: listResult.code,
        };
      }
      const entries = listResult.stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const verboseResult = await runCommandWithTimeout(["tar", "tvf", archivePath], { timeoutMs });
      if (verboseResult.code !== 0) {
        return {
          stdout: verboseResult.stdout,
          stderr: verboseResult.stderr || "tar verbose list failed",
          code: verboseResult.code,
        };
      }
      for (const line of verboseResult.stdout.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }
        const typeChar = trimmed[0];
        if (typeChar === "l" || typeChar === "h" || trimmed.includes(" -> ")) {
          return {
            stdout: verboseResult.stdout,
            stderr: "tar archive contains link entries; refusing to extract for safety",
            code: 1,
          };
        }
      }

      for (const entry of entries) {
        validateArchiveEntryPath(entry, { escapeLabel: "targetDir" });
        const relPath = stripArchivePath(entry, strip);
        if (!relPath) {
          continue;
        }
        validateArchiveEntryPath(relPath, { escapeLabel: "targetDir" });
        resolveArchiveOutputPath({
          rootDir: targetDir,
          relPath,
          originalPath: entry,
          escapeLabel: "targetDir",
        });
      }

      const argv = ["tar", "xf", archivePath, "-C", targetDir];
      if (strip > 0) {
        argv.push("--strip-components", String(strip));
      }
      return await runCommandWithTimeout(argv, { timeoutMs });
    }

    return { stdout: "", stderr: `unsupported archive type: ${archiveType}`, code: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout: "", stderr: message, code: 1 };
  }
}

export async function installDownloadSpec(params: {
  entry: SkillEntry;
  spec: SkillInstallSpec;
  timeoutMs: number;
}): Promise<SkillInstallResult> {
  const { entry, spec, timeoutMs } = params;
  const url = spec.url?.trim();
  if (!url) {
    return {
      ok: false,
      message: "missing download url",
      stdout: "",
      stderr: "",
      code: null,
    };
  }

  let filename = "";
  try {
    const parsed = new URL(url);
    filename = path.basename(parsed.pathname);
  } catch {
    filename = path.basename(url);
  }
  if (!filename) {
    filename = "download";
  }

  let targetDir = "";
  try {
    targetDir = resolveDownloadTargetDir(entry, spec);
    await ensureDir(targetDir);
    const stat = await fs.promises.lstat(targetDir);
    if (stat.isSymbolicLink()) {
      throw new Error(`targetDir is a symlink: ${targetDir}`);
    }
    if (!stat.isDirectory()) {
      throw new Error(`targetDir is not a directory: ${targetDir}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message, stdout: "", stderr: message, code: null };
  }

  const archivePath = path.join(targetDir, filename);
  let downloaded = 0;
  try {
    const result = await downloadFile(url, archivePath, timeoutMs);
    downloaded = result.bytes;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message, stdout: "", stderr: message, code: null };
  }

  const archiveType = resolveArchiveType(spec, filename);
  const shouldExtract = spec.extract ?? Boolean(archiveType);
  if (!shouldExtract) {
    return {
      ok: true,
      message: `Downloaded to ${archivePath}`,
      stdout: `downloaded=${downloaded}`,
      stderr: "",
      code: 0,
    };
  }

  if (!archiveType) {
    return {
      ok: false,
      message: "extract requested but archive type could not be detected",
      stdout: "",
      stderr: "",
      code: null,
    };
  }

  const extractResult = await extractArchive({
    archivePath,
    archiveType,
    targetDir,
    stripComponents: spec.stripComponents,
    timeoutMs,
  });
  const success = extractResult.code === 0;
  return {
    ok: success,
    message: success
      ? `Downloaded and extracted to ${targetDir}`
      : formatInstallFailureMessage(extractResult),
    stdout: extractResult.stdout.trim(),
    stderr: extractResult.stderr.trim(),
    code: extractResult.code,
  };
}
