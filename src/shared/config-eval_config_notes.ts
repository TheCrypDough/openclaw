# AUTOPLACEHOLDER_ANNOTATION: src/shared/config-eval.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveConfigPath(config: unknown, pathStr: string): unknown {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = pathStr.split(".").filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current: unknown = config;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isConfigPathTruthyWithDefaults(
  config: unknown,
  pathStr: string,
  defaults: Record<string, boolean>,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = resolveConfigPath(config, pathStr);
  if (value === undefined && pathStr in defaults) {
    return defaults[pathStr] ?? false;
  }
  return isTruthy(value);
}

export type RuntimeRequires = {
  bins?: string[];
  anyBins?: string[];
  env?: string[];
  config?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function evaluateRuntimeRequires(params: {
  requires?: RuntimeRequires;
  hasBin: (bin: string) => boolean;
  hasAnyRemoteBin?: (bins: string[]) => boolean;
  hasRemoteBin?: (bin: string) => boolean;
  hasEnv: (envName: string) => boolean;
  isConfigPathTruthy: (pathStr: string) => boolean;
}): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requires = params.requires;
  if (!requires) {
    return true;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requiredBins = requires.bins ?? [];
  if (requiredBins.length > 0) {
    for (const bin of requiredBins) {
      if (params.hasBin(bin)) {
        continue;
      }
      if (params.hasRemoteBin?.(bin)) {
        continue;
      }
      return false;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requiredAnyBins = requires.anyBins ?? [];
  if (requiredAnyBins.length > 0) {
    const anyFound = requiredAnyBins.some((bin) => params.hasBin(bin));
    if (!anyFound && !params.hasAnyRemoteBin?.(requiredAnyBins)) {
      return false;
    }
  }

  const requiredEnv = requires.env ?? [];
  if (requiredEnv.length > 0) {
    for (const envName of requiredEnv) {
      if (!params.hasEnv(envName)) {
        return false;
      }
    }
  }

  const requiredConfig = requires.config ?? [];
  if (requiredConfig.length > 0) {
    for (const configPath of requiredConfig) {
      if (!params.isConfigPathTruthy(configPath)) {
        return false;
      }
    }
  }

  return true;
}

export function resolveRuntimePlatform(): string {
  return process.platform;
}

function windowsPathExtensions(): string[] {
  const raw = process.env.PATHEXT;
  const list =
    raw !== undefined ? raw.split(";").map((v) => v.trim()) : [".EXE", ".CMD", ".BAT", ".COM"];
  return ["", ...list.filter(Boolean)];
}

let cachedHasBinaryPath: string | undefined;
let cachedHasBinaryPathExt: string | undefined;
const hasBinaryCache = new Map<string, boolean>();

export function hasBinary(bin: string): boolean {
  const pathEnv = process.env.PATH ?? "";
  const pathExt = process.platform === "win32" ? (process.env.PATHEXT ?? "") : "";
  if (cachedHasBinaryPath !== pathEnv || cachedHasBinaryPathExt !== pathExt) {
    cachedHasBinaryPath = pathEnv;
    cachedHasBinaryPathExt = pathExt;
    hasBinaryCache.clear();
  }
  if (hasBinaryCache.has(bin)) {
    return hasBinaryCache.get(bin)!;
  }

  const parts = pathEnv.split(path.delimiter).filter(Boolean);
  const extensions = process.platform === "win32" ? windowsPathExtensions() : [""];
  for (const part of parts) {
    for (const ext of extensions) {
      const candidate = path.join(part, bin + ext);
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        hasBinaryCache.set(bin, true);
        return true;
      } catch {
        // keep scanning
      }
    }
  }
  hasBinaryCache.set(bin, false);
  return false;
}
