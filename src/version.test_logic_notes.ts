/*
 * AUTO ANNOTATION
 * File: src/version.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  readVersionFromBuildInfoForModuleUrl,
  readVersionFromPackageJsonForModuleUrl,
  resolveRuntimeServiceVersion,
  resolveVersionFromModuleUrl,
} from "./version.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withTempDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-version-"));
  try {
    return await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function moduleUrlFrom(root: string, relativePath: string): string {
  return pathToFileURL(path.join(root, relativePath)).href;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function ensureModuleFixture(root: string, relativePath = "dist/plugin-sdk/index.js") {
  await fs.mkdir(path.dirname(path.join(root, relativePath)), { recursive: true });
  return moduleUrlFrom(root, relativePath);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function writeJsonFixture(root: string, relativePath: string, value: unknown) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value), "utf-8");
}

describe("version resolution", () => {
  it("resolves package version from nested dist/plugin-sdk module URL", async () => {
    await withTempDir(async (root) => {
      await writeJsonFixture(root, "package.json", { name: "openclaw", version: "1.2.3" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const moduleUrl = await ensureModuleFixture(root);
      expect(readVersionFromPackageJsonForModuleUrl(moduleUrl)).toBe("1.2.3");
      expect(resolveVersionFromModuleUrl(moduleUrl)).toBe("1.2.3");
    });
  });

  it("ignores unrelated nearby package.json files", async () => {
    await withTempDir(async (root) => {
      await writeJsonFixture(root, "package.json", { name: "openclaw", version: "2.3.4" });
      await writeJsonFixture(root, "dist/package.json", {
        name: "other-package",
        version: "9.9.9",
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const moduleUrl = await ensureModuleFixture(root);
      expect(readVersionFromPackageJsonForModuleUrl(moduleUrl)).toBe("2.3.4");
    });
  });

  it("falls back to build-info when package metadata is unavailable", async () => {
    await withTempDir(async (root) => {
      await writeJsonFixture(root, "build-info.json", { version: "4.5.6" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const moduleUrl = await ensureModuleFixture(root);
      expect(readVersionFromPackageJsonForModuleUrl(moduleUrl)).toBeNull();
      expect(readVersionFromBuildInfoForModuleUrl(moduleUrl)).toBe("4.5.6");
      expect(resolveVersionFromModuleUrl(moduleUrl)).toBe("4.5.6");
    });
  });

  it("returns null when no version metadata exists", async () => {
    await withTempDir(async (root) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const moduleUrl = await ensureModuleFixture(root);
      expect(readVersionFromPackageJsonForModuleUrl(moduleUrl)).toBeNull();
      expect(readVersionFromBuildInfoForModuleUrl(moduleUrl)).toBeNull();
      expect(resolveVersionFromModuleUrl(moduleUrl)).toBeNull();
    });
  });

  it("ignores non-openclaw package and blank build-info versions", async () => {
    await withTempDir(async (root) => {
      await writeJsonFixture(root, "package.json", { name: "other-package", version: "9.9.9" });
      await writeJsonFixture(root, "build-info.json", { version: "  " });
      const moduleUrl = await ensureModuleFixture(root);
      expect(readVersionFromPackageJsonForModuleUrl(moduleUrl)).toBeNull();
      expect(readVersionFromBuildInfoForModuleUrl(moduleUrl)).toBeNull();
      expect(resolveVersionFromModuleUrl(moduleUrl)).toBeNull();
    });
  });

  it("returns null for malformed module URLs", () => {
    expect(readVersionFromPackageJsonForModuleUrl("not-a-valid-url")).toBeNull();
    expect(readVersionFromBuildInfoForModuleUrl("not-a-valid-url")).toBeNull();
    expect(resolveVersionFromModuleUrl("not-a-valid-url")).toBeNull();
  });

  it("prefers OPENCLAW_VERSION over service and package versions", () => {
    expect(
      resolveRuntimeServiceVersion({
        OPENCLAW_VERSION: "9.9.9",
        OPENCLAW_SERVICE_VERSION: "2.2.2",
        npm_package_version: "1.1.1",
      }),
    ).toBe("9.9.9");
  });

  it("uses service and package fallbacks and ignores blank env values", () => {
    expect(
      resolveRuntimeServiceVersion({
        OPENCLAW_VERSION: "   ",
        OPENCLAW_SERVICE_VERSION: "  2.0.0  ",
        npm_package_version: "1.0.0",
      }),
    ).toBe("2.0.0");

    expect(
      resolveRuntimeServiceVersion({
        OPENCLAW_VERSION: " ",
        OPENCLAW_SERVICE_VERSION: "\t",
        npm_package_version: " 1.0.0-package ",
      }),
    ).toBe("1.0.0-package");

    expect(
      resolveRuntimeServiceVersion(
        {
          OPENCLAW_VERSION: "",
          OPENCLAW_SERVICE_VERSION: " ",
          npm_package_version: "",
        },
        "fallback",
      ),
    ).toBe("fallback");
  });
});
