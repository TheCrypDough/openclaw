/*
 * AUTO ANNOTATION
 * File: src/config/version.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type OpenClawVersion = {
  major: number;
  minor: number;
  patch: number;
  revision: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-(\d+))?/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseOpenClawVersion(raw: string | null | undefined): OpenClawVersion | null {
  if (!raw) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = raw.trim().match(VERSION_RE);
  if (!match) {
    return null;
  }
  const [, major, minor, patch, revision] = match;
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
    revision: revision ? Number.parseInt(revision, 10) : 0,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function compareOpenClawVersions(
  a: string | null | undefined,
  b: string | null | undefined,
): number | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsedA = parseOpenClawVersion(a);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsedB = parseOpenClawVersion(b);
  if (!parsedA || !parsedB) {
    return null;
  }
  if (parsedA.major !== parsedB.major) {
    return parsedA.major < parsedB.major ? -1 : 1;
  }
  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor < parsedB.minor ? -1 : 1;
  }
  if (parsedA.patch !== parsedB.patch) {
    return parsedA.patch < parsedB.patch ? -1 : 1;
  }
  if (parsedA.revision !== parsedB.revision) {
    return parsedA.revision < parsedB.revision ? -1 : 1;
  }
  return 0;
}
