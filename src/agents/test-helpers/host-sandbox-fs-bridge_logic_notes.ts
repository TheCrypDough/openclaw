/*
 * AUTO ANNOTATION
 * File: src/agents/test-helpers/host-sandbox-fs-bridge.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { resolveSandboxPath } from "../sandbox-paths.js";
import type { SandboxFsBridge, SandboxFsStat, SandboxResolvedPath } from "../sandbox/fs-bridge.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSandboxFsBridgeFromResolver(
  resolvePath: (filePath: string, cwd?: string) => SandboxResolvedPath,
): SandboxFsBridge {
  return {
    resolvePath: ({ filePath, cwd }) => resolvePath(filePath, cwd),
    readFile: async ({ filePath, cwd }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = resolvePath(filePath, cwd);
      return fs.readFile(target.hostPath);
    },
    writeFile: async ({ filePath, cwd, data, mkdir = true }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = resolvePath(filePath, cwd);
      if (mkdir) {
        await fs.mkdir(path.dirname(target.hostPath), { recursive: true });
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
      await fs.writeFile(target.hostPath, buffer);
    },
    mkdirp: async ({ filePath, cwd }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = resolvePath(filePath, cwd);
      await fs.mkdir(target.hostPath, { recursive: true });
    },
    remove: async ({ filePath, cwd, recursive, force }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = resolvePath(filePath, cwd);
      await fs.rm(target.hostPath, {
        recursive: recursive ?? false,
        force: force ?? false,
      });
    },
    rename: async ({ from, to, cwd }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const source = resolvePath(from, cwd);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const target = resolvePath(to, cwd);
      await fs.mkdir(path.dirname(target.hostPath), { recursive: true });
      await fs.rename(source.hostPath, target.hostPath);
    },
    stat: async ({ filePath, cwd }) => {
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const target = resolvePath(filePath, cwd);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const stats = await fs.stat(target.hostPath);
        return {
          type: stats.isDirectory() ? "directory" : stats.isFile() ? "file" : "other",
          size: stats.size,
          mtimeMs: stats.mtimeMs,
        } satisfies SandboxFsStat;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return null;
        }
        throw error;
      }
    },
  };
}

export function createHostSandboxFsBridge(rootDir: string): SandboxFsBridge {
  const root = path.resolve(rootDir);

  const resolvePath = (filePath: string, cwd?: string): SandboxResolvedPath => {
    const resolved = resolveSandboxPath({
      filePath,
      cwd: cwd ?? root,
      root,
    });
    const relativePath = resolved.relative
      ? resolved.relative.split(path.sep).filter(Boolean).join(path.posix.sep)
      : "";
    const containerPath = relativePath ? path.posix.join("/workspace", relativePath) : "/workspace";
    return {
      hostPath: resolved.resolved,
      relativePath,
      containerPath,
    };
  };

  return createSandboxFsBridgeFromResolver(resolvePath);
}
