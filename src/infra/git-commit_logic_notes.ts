/*
 * AUTO ANNOTATION
 * File: src/infra/git-commit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { resolveGitHeadPath } from "./git-root.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const formatCommit = (value?: string | null) => {
  if (!value) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.length > 7 ? trimmed.slice(0, 7) : trimmed;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let cachedCommit: string | null | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readCommitFromPackageJson = () => {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const require = createRequire(import.meta.url);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pkg = require("../../package.json") as {
      gitHead?: string;
      githead?: string;
    };
    return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
  } catch {
    return null;
  }
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readCommitFromBuildInfo = () => {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const require = createRequire(import.meta.url);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidates = ["../build-info.json", "./build-info.json"];
    for (const candidate of candidates) {
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const info = require(candidate) as {
          commit?: string | null;
        };
        const formatted = formatCommit(info.commit ?? null);
        if (formatted) {
          return formatted;
        }
      } catch {
        // ignore missing candidate
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const resolveCommitHash = (options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) => {
  if (cachedCommit !== undefined) {
    return cachedCommit;
  }
  const env = options.env ?? process.env;
  const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
  const normalized = formatCommit(envCommit);
  if (normalized) {
    cachedCommit = normalized;
    return cachedCommit;
  }
  const buildInfoCommit = readCommitFromBuildInfo();
  if (buildInfoCommit) {
    cachedCommit = buildInfoCommit;
    return cachedCommit;
  }
  const pkgCommit = readCommitFromPackageJson();
  if (pkgCommit) {
    cachedCommit = pkgCommit;
    return cachedCommit;
  }
  try {
    const headPath = resolveGitHeadPath(options.cwd ?? process.cwd());
    if (!headPath) {
      cachedCommit = null;
      return cachedCommit;
    }
    const head = fs.readFileSync(headPath, "utf-8").trim();
    if (!head) {
      cachedCommit = null;
      return cachedCommit;
    }
    if (head.startsWith("ref:")) {
      const ref = head.replace(/^ref:\s*/i, "").trim();
      const refPath = path.resolve(path.dirname(headPath), ref);
      const refHash = fs.readFileSync(refPath, "utf-8").trim();
      cachedCommit = formatCommit(refHash);
      return cachedCommit;
    }
    cachedCommit = formatCommit(head);
    return cachedCommit;
  } catch {
    cachedCommit = null;
    return cachedCommit;
  }
};
