/*
 * AUTO ANNOTATION
 * File: src/commands/status.update.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { UpdateCheckResult } from "../infra/update-check.js";
import { VERSION } from "../version.js";
import {
  formatUpdateAvailableHint,
  formatUpdateOneLiner,
  resolveUpdateAvailability,
} from "./status.update.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildUpdate(partial: Partial<UpdateCheckResult>): UpdateCheckResult {
  return {
    root: null,
    installKind: "unknown",
    packageManager: "unknown",
    ...partial,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function nextMajorVersion(version: string): string {
  const [majorPart] = version.split(".");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const major = Number.parseInt(majorPart ?? "", 10);
  if (Number.isFinite(major) && major >= 0) {
    return `${major + 1}.0.0`;
  }
  return "999999.0.0";
}

describe("resolveUpdateAvailability", () => {
  it("flags git update when behind upstream", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const update = buildUpdate({
      installKind: "git",
      git: {
        root: "/tmp/repo",
        sha: null,
        tag: null,
        branch: "main",
        upstream: "origin/main",
        dirty: false,
        ahead: 0,
        behind: 3,
        fetchOk: true,
      },
    });
    expect(resolveUpdateAvailability(update)).toEqual({
      available: true,
      hasGitUpdate: true,
      hasRegistryUpdate: false,
      latestVersion: null,
      gitBehind: 3,
    });
  });

  it("flags registry update when latest version is newer", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const latestVersion = nextMajorVersion(VERSION);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const update = buildUpdate({
      installKind: "package",
      packageManager: "pnpm",
      registry: { latestVersion },
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const availability = resolveUpdateAvailability(update);
    expect(availability.available).toBe(true);
    expect(availability.hasGitUpdate).toBe(false);
    expect(availability.hasRegistryUpdate).toBe(true);
    expect(availability.latestVersion).toBe(latestVersion);
  });
});

describe("formatUpdateOneLiner", () => {
  it("renders git status and registry latest summary", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const update = buildUpdate({
      installKind: "git",
      git: {
        root: "/tmp/repo",
        sha: "abc123456789",
        tag: null,
        branch: "main",
        upstream: "origin/main",
        dirty: true,
        ahead: 0,
        behind: 2,
        fetchOk: true,
      },
      registry: { latestVersion: VERSION },
      deps: {
        manager: "pnpm",
        status: "ok",
        lockfilePath: "pnpm-lock.yaml",
        markerPath: "node_modules/.modules.yaml",
      },
    });

    expect(formatUpdateOneLiner(update)).toBe(
      `Update: git main · ↔ origin/main · dirty · behind 2 · npm latest ${VERSION} · deps ok`,
    );
  });

  it("renders package-manager mode with registry error", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const update = buildUpdate({
      installKind: "package",
      packageManager: "npm",
      registry: { latestVersion: null, error: "offline" },
      deps: {
        manager: "npm",
        status: "missing",
        lockfilePath: "package-lock.json",
        markerPath: "node_modules",
      },
    });

    expect(formatUpdateOneLiner(update)).toBe("Update: npm · npm latest unknown · deps missing");
  });
});

describe("formatUpdateAvailableHint", () => {
  it("returns null when no update is available", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const update = buildUpdate({
      installKind: "package",
      packageManager: "pnpm",
      registry: { latestVersion: VERSION },
    });

    expect(formatUpdateAvailableHint(update)).toBeNull();
  });

  it("renders git and registry update details", () => {
    const latestVersion = nextMajorVersion(VERSION);
    const update = buildUpdate({
      installKind: "git",
      git: {
        root: "/tmp/repo",
        sha: null,
        tag: null,
        branch: "main",
        upstream: "origin/main",
        dirty: false,
        ahead: 0,
        behind: 2,
        fetchOk: true,
      },
      registry: { latestVersion },
    });

    expect(formatUpdateAvailableHint(update)).toBe(
      `Update available (git behind 2 · npm ${latestVersion}). Run: openclaw update`,
    );
  });
});
