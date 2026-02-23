/*
 * AUTO ANNOTATION
 * File: src/dockerfile.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const dockerfilePath = join(repoRoot, "Dockerfile");

describe("Dockerfile", () => {
  it("installs optional browser dependencies after pnpm install", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dockerfile = await readFile(dockerfilePath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const installIndex = dockerfile.indexOf("RUN pnpm install --frozen-lockfile");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const browserArgIndex = dockerfile.indexOf("ARG OPENCLAW_INSTALL_BROWSER");

    expect(installIndex).toBeGreaterThan(-1);
    expect(browserArgIndex).toBeGreaterThan(-1);
    expect(browserArgIndex).toBeGreaterThan(installIndex);
    expect(dockerfile).toContain(
      "node /app/node_modules/playwright-core/cli.js install --with-deps chromium",
    );
    expect(dockerfile).toContain("apt-get install -y --no-install-recommends xvfb");
  });
});
