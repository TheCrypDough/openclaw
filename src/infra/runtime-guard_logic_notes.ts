/*
 * AUTO ANNOTATION
 * File: src/infra/runtime-guard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import process from "node:process";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";

export type RuntimeKind = "node" | "unknown";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Semver = {
  major: number;
  minor: number;
  patch: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MIN_NODE: Semver = { major: 22, minor: 12, patch: 0 };

export type RuntimeDetails = {
  kind: RuntimeKind;
  version: string | null;
  execPath: string | null;
  pathEnv: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSemver(version: string | null): Semver | null {
  if (!version) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = version.match(SEMVER_RE);
  if (!match) {
    return null;
  }
  const [, major, minor, patch] = match;
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isAtLeast(version: Semver | null, minimum: Semver): boolean {
  if (!version) {
    return false;
  }
  if (version.major !== minimum.major) {
    return version.major > minimum.major;
  }
  if (version.minor !== minimum.minor) {
    return version.minor > minimum.minor;
  }
  return version.patch >= minimum.patch;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function detectRuntime(): RuntimeDetails {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const kind: RuntimeKind = process.versions?.node ? "node" : "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const version = process.versions?.node ?? null;

  return {
    kind,
    version,
    execPath: process.execPath ?? null,
    pathEnv: process.env.PATH ?? "(not set)",
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function runtimeSatisfies(details: RuntimeDetails): boolean {
  const parsed = parseSemver(details.version);
  if (details.kind === "node") {
    return isAtLeast(parsed, MIN_NODE);
  }
  return false;
}

export function isSupportedNodeVersion(version: string | null): boolean {
  return isAtLeast(parseSemver(version), MIN_NODE);
}

export function assertSupportedRuntime(
  runtime: RuntimeEnv = defaultRuntime,
  details: RuntimeDetails = detectRuntime(),
): void {
  if (runtimeSatisfies(details)) {
    return;
  }

  const versionLabel = details.version ?? "unknown";
  const runtimeLabel =
    details.kind === "unknown" ? "unknown runtime" : `${details.kind} ${versionLabel}`;
  const execLabel = details.execPath ?? "unknown";

  runtime.error(
    [
      "openclaw requires Node >=22.12.0.",
      `Detected: ${runtimeLabel} (exec: ${execLabel}).`,
      `PATH searched: ${details.pathEnv}`,
      "Install Node: https://nodejs.org/en/download",
      "Upgrade Node and re-run openclaw.",
    ].join("\n"),
  );
  runtime.exit(1);
}
