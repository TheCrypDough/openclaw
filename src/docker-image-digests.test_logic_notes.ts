/*
 * AUTO ANNOTATION
 * File: src/docker-image-digests.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DIGEST_PINNED_DOCKERFILES = [
  "Dockerfile",
  "Dockerfile.sandbox",
  "Dockerfile.sandbox-browser",
  "scripts/docker/cleanup-smoke/Dockerfile",
  "scripts/docker/install-sh-e2e/Dockerfile",
  "scripts/docker/install-sh-nonroot/Dockerfile",
  "scripts/docker/install-sh-smoke/Dockerfile",
  "scripts/e2e/Dockerfile",
  "scripts/e2e/Dockerfile.qr-import",
] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DependabotDockerGroup = {
  patterns?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DependabotUpdate = {
  "package-ecosystem"?: string;
  directory?: string;
  schedule?: { interval?: string };
  groups?: Record<string, DependabotDockerGroup>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DependabotConfig = {
  updates?: DependabotUpdate[];
};

describe("docker base image pinning", () => {
  it("pins selected Dockerfile FROM lines to immutable sha256 digests", async () => {
    for (const dockerfilePath of DIGEST_PINNED_DOCKERFILES) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const dockerfile = await readFile(resolve(repoRoot, dockerfilePath), "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const fromLine = dockerfile
        .split(/\r?\n/)
        .find((line) => line.trimStart().startsWith("FROM "));
      expect(fromLine, `${dockerfilePath} should define a FROM line`).toBeDefined();
      expect(fromLine, `${dockerfilePath} FROM must be digest-pinned`).toMatch(
        /^FROM\s+\S+@sha256:[a-f0-9]{64}$/,
      );
    }
  });

  it("keeps Dependabot Docker updates enabled for root Dockerfiles", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await readFile(resolve(repoRoot, ".github/dependabot.yml"), "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = parse(raw) as DependabotConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dockerUpdate = config.updates?.find(
      (update) => update["package-ecosystem"] === "docker" && update.directory === "/",
    );

    expect(dockerUpdate).toBeDefined();
    expect(dockerUpdate?.schedule?.interval).toBe("weekly");
    expect(dockerUpdate?.groups?.["docker-images"]?.patterns).toContain("*");
  });
});
