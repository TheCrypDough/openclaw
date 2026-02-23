/*
 * AUTO ANNOTATION
 * File: src/infra/exec-safe-bin-trust.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_SAFE_BIN_TRUSTED_DIRS = [
  "/bin",
  "/usr/bin",
  "/usr/local/bin",
  "/opt/homebrew/bin",
  "/opt/local/bin",
  "/snap/bin",
  "/run/current-system/sw/bin",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TrustedSafeBinDirsParams = {
  pathEnv?: string | null;
  delimiter?: string;
  baseDirs?: readonly string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TrustedSafeBinPathParams = {
  resolvedPath: string;
  trustedDirs?: ReadonlySet<string>;
  pathEnv?: string | null;
  delimiter?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TrustedSafeBinCache = {
  key: string;
  dirs: Set<string>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let trustedSafeBinCache: TrustedSafeBinCache | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STARTUP_PATH_ENV = process.env.PATH ?? process.env.Path ?? "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeTrustedDir(value: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return path.resolve(trimmed);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildTrustedSafeBinCacheKey(pathEnv: string, delimiter: string): string {
  return `${delimiter}\u0000${pathEnv}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTrustedSafeBinDirs(params: TrustedSafeBinDirsParams = {}): Set<string> {
  const delimiter = params.delimiter ?? path.delimiter;
  const pathEnv = params.pathEnv ?? "";
  const baseDirs = params.baseDirs ?? DEFAULT_SAFE_BIN_TRUSTED_DIRS;
  const trusted = new Set<string>();

  for (const entry of baseDirs) {
    const normalized = normalizeTrustedDir(entry);
    if (normalized) {
      trusted.add(normalized);
    }
  }

  const pathEntries = pathEnv
    .split(delimiter)
    .map((entry) => normalizeTrustedDir(entry))
    .filter((entry): entry is string => Boolean(entry));
  for (const entry of pathEntries) {
    trusted.add(entry);
  }

  return trusted;
}

export function getTrustedSafeBinDirs(
  params: {
    pathEnv?: string | null;
    delimiter?: string;
    refresh?: boolean;
  } = {},
): Set<string> {
  const delimiter = params.delimiter ?? path.delimiter;
  const pathEnv = params.pathEnv ?? STARTUP_PATH_ENV;
  const key = buildTrustedSafeBinCacheKey(pathEnv, delimiter);

  if (!params.refresh && trustedSafeBinCache?.key === key) {
    return trustedSafeBinCache.dirs;
  }

  const dirs = buildTrustedSafeBinDirs({
    pathEnv,
    delimiter,
  });
  trustedSafeBinCache = { key, dirs };
  return dirs;
}

export function isTrustedSafeBinPath(params: TrustedSafeBinPathParams): boolean {
  const trustedDirs =
    params.trustedDirs ??
    getTrustedSafeBinDirs({
      pathEnv: params.pathEnv,
      delimiter: params.delimiter,
    });
  const resolvedDir = path.dirname(path.resolve(params.resolvedPath));
  return trustedDirs.has(resolvedDir);
}
