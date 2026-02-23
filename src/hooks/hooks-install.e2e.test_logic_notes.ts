/*
 * AUTO ANNOTATION
 * File: src/hooks/hooks-install.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installHooksFromPath } from "./install.js";
import {
  clearInternalHooks,
  createInternalHookEvent,
  triggerInternalHook,
} from "./internal-hooks.js";
import { loadInternalHooks } from "./loader.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const tempDirs: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function makeTempDir() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-hooks-e2e-"));
  tempDirs.push(dir);
  return dir;
}

describe("hooks install (e2e)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let workspaceDir: string;

  beforeEach(async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const baseDir = await makeTempDir();
    workspaceDir = path.join(baseDir, "workspace");
    await fs.mkdir(workspaceDir, { recursive: true });
  });

  afterEach(async () => {
    for (const dir of tempDirs.splice(0)) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
      } catch {
        // ignore cleanup failures
      }
    }
  });

  it("installs a hook pack and triggers the handler", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const baseDir = await makeTempDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const packDir = path.join(baseDir, "hook-pack");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hookDir = path.join(packDir, "hooks", "hello-hook");
    await fs.mkdir(hookDir, { recursive: true });

    await fs.writeFile(
      path.join(packDir, "package.json"),
      JSON.stringify(
        {
          name: "@acme/hello-hooks",
          version: "0.0.0",
          openclaw: { hooks: ["./hooks/hello-hook"] },
        },
        null,
        2,
      ),
      "utf-8",
    );

    await fs.writeFile(
      path.join(hookDir, "HOOK.md"),
      [
        "---",
        'name: "hello-hook"',
        'description: "Test hook"',
        'metadata: {"openclaw":{"events":["command:new"]}}',
        "---",
        "",
        "# Hello Hook",
        "",
      ].join("\n"),
      "utf-8",
    );

    await fs.writeFile(
      path.join(hookDir, "handler.js"),
      "export default async function(event) { event.messages.push('hook-ok'); }\n",
      "utf-8",
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hooksDir = path.join(baseDir, "managed-hooks");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const installResult = await installHooksFromPath({ path: packDir, hooksDir });
    expect(installResult.ok).toBe(true);
    if (!installResult.ok) {
      return;
    }

    clearInternalHooks();
    const bundledHooksDir = path.join(baseDir, "bundled-none");
    await fs.mkdir(bundledHooksDir, { recursive: true });
    const loaded = await loadInternalHooks(
      {
        hooks: {
          internal: {
            enabled: true,
            load: { extraDirs: [hooksDir] },
          },
        },
      },
      workspaceDir,
      { managedHooksDir: hooksDir, bundledHooksDir },
    );
    expect(loaded).toBeGreaterThanOrEqual(1);

    const event = createInternalHookEvent("command", "new", "test-session");
    await triggerInternalHook(event);
    expect(event.messages).toContain("hook-ok");
  });
});
