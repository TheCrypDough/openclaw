/*
 * AUTO ANNOTATION
 * File: src/version.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createRequire } from "node:module";

declare const __OPENCLAW_VERSION__: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CORE_PACKAGE_NAME = "openclaw";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PACKAGE_JSON_CANDIDATES = [
  "../package.json",
  "../../package.json",
  "../../../package.json",
  "./package.json",
] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BUILD_INFO_CANDIDATES = [
  "../build-info.json",
  "../../build-info.json",
  "./build-info.json",
] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readVersionFromJsonCandidates(
  moduleUrl: string,
  candidates: readonly string[],
  opts: { requirePackageName?: boolean } = {},
): string | null {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const require = createRequire(moduleUrl);
    for (const candidate of candidates) {
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const parsed = require(candidate) as { name?: string; version?: string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const version = parsed.version?.trim();
        if (!version) {
          continue;
        }
        if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) {
          continue;
        }
        return version;
      } catch {
        // ignore missing or unreadable candidate
      }
    }
    return null;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readVersionFromPackageJsonForModuleUrl(moduleUrl: string): string | null {
  return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, {
    requirePackageName: true,
  });
}

export function readVersionFromBuildInfoForModuleUrl(moduleUrl: string): string | null {
  return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}

export function resolveVersionFromModuleUrl(moduleUrl: string): string | null {
  return (
    readVersionFromPackageJsonForModuleUrl(moduleUrl) ||
    readVersionFromBuildInfoForModuleUrl(moduleUrl)
  );
}

export type RuntimeVersionEnv = {
  [key: string]: string | undefined;
};

export function resolveRuntimeServiceVersion(
  env: RuntimeVersionEnv = process.env as RuntimeVersionEnv,
  fallback = "dev",
): string {
  return (
    firstNonEmpty(
      env["OPENCLAW_VERSION"],
      env["OPENCLAW_SERVICE_VERSION"],
      env["npm_package_version"],
    ) ?? fallback
  );
}

// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
  process.env.OPENCLAW_BUNDLED_VERSION ||
  resolveVersionFromModuleUrl(import.meta.url) ||
  "0.0.0";
