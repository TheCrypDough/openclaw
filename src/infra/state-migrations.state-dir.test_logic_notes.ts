/*
 * AUTO ANNOTATION
 * File: src/infra/state-migrations.state-dir.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  autoMigrateLegacyStateDir,
  resetAutoMigrateLegacyStateDirForTest,
} from "./state-migrations.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let tempRoot: string | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function makeTempRoot() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = await fs.promises.mkdtemp(path.join(os.tmpdir(), "openclaw-state-dir-"));
  tempRoot = root;
  return root;
}

afterEach(async () => {
  resetAutoMigrateLegacyStateDirForTest();
  if (!tempRoot) {
    return;
  }
  await fs.promises.rm(tempRoot, { recursive: true, force: true });
  tempRoot = null;
});

describe("legacy state dir auto-migration", () => {
  it("follows legacy symlink when it points at another legacy dir (clawdbot -> moltbot)", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = await makeTempRoot();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const legacySymlink = path.join(root, ".clawdbot");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const legacyDir = path.join(root, ".moltbot");

    fs.mkdirSync(legacyDir, { recursive: true });
    fs.writeFileSync(path.join(legacyDir, "marker.txt"), "ok", "utf-8");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dirLinkType = process.platform === "win32" ? "junction" : "dir";
    fs.symlinkSync(legacyDir, legacySymlink, dirLinkType);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await autoMigrateLegacyStateDir({
      env: {} as NodeJS.ProcessEnv,
      homedir: () => root,
    });

    expect(result.migrated).toBe(true);
    expect(result.warnings).toEqual([]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const targetMarker = path.join(root, ".openclaw", "marker.txt");
    expect(fs.readFileSync(targetMarker, "utf-8")).toBe("ok");
    expect(fs.readFileSync(path.join(root, ".moltbot", "marker.txt"), "utf-8")).toBe("ok");
    expect(fs.readFileSync(path.join(root, ".clawdbot", "marker.txt"), "utf-8")).toBe("ok");
  });
});
