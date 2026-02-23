# AUTOPLACEHOLDER_ANNOTATION: src/config/config.backup-rotation.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { rotateConfigBackups } from "./backup-rotation.js";
import { withTempHome } from "./test-helpers.js";
import type { OpenClawConfig } from "./types.js";

describe("config backup rotation", () => {
  it("keeps a 5-deep backup ring for config writes", async () => {
    await withTempHome(async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
      if (!stateDir) {
        throw new Error("Expected OPENCLAW_STATE_DIR to be set by withTempHome");
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const configPath = path.join(stateDir, "openclaw.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const buildConfig = (version: number): OpenClawConfig =>
        ({
          agents: { list: [{ id: `v${version}` }] },
        }) as OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const writeVersion = async (version: number) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const json = JSON.stringify(buildConfig(version), null, 2).trimEnd().concat("\n");
        await fs.writeFile(configPath, json, "utf-8");
      };

      await writeVersion(0);
      for (let version = 1; version <= 6; version += 1) {
        await rotateConfigBackups(configPath, fs);
        await fs.copyFile(configPath, `${configPath}.bak`).catch(() => {
          // best-effort
        });
        await writeVersion(version);
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const readName = async (suffix = "") => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const raw = await fs.readFile(`${configPath}${suffix}`, "utf-8");
        return (
          (JSON.parse(raw) as { agents?: { list?: Array<{ id?: string }> } }).agents?.list?.[0]
            ?.id ?? null
        );
      };

      await expect(readName()).resolves.toBe("v6");
      await expect(readName(".bak")).resolves.toBe("v5");
      await expect(readName(".bak.1")).resolves.toBe("v4");
      await expect(readName(".bak.2")).resolves.toBe("v3");
      await expect(readName(".bak.3")).resolves.toBe("v2");
      await expect(readName(".bak.4")).resolves.toBe("v1");
      await expect(fs.stat(`${configPath}.bak.5`)).rejects.toThrow();
    });
  });
});
