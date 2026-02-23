/*
 * AUTO ANNOTATION
 * File: src/hooks/workspace.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MANIFEST_KEY } from "../compat/legacy-names.js";
import { loadHookEntriesFromDir } from "./workspace.js";

describe("hooks workspace", () => {
  it("ignores package.json hook paths that traverse outside package directory", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-hooks-workspace-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hooksRoot = path.join(root, "hooks");
    fs.mkdirSync(hooksRoot, { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pkgDir = path.join(hooksRoot, "pkg");
    fs.mkdirSync(pkgDir, { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const outsideHookDir = path.join(root, "outside");
    fs.mkdirSync(outsideHookDir, { recursive: true });
    fs.writeFileSync(path.join(outsideHookDir, "HOOK.md"), "---\nname: outside\n---\n");
    fs.writeFileSync(path.join(outsideHookDir, "handler.js"), "export default async () => {};\n");

    fs.writeFileSync(
      path.join(pkgDir, "package.json"),
      JSON.stringify(
        {
          name: "pkg",
          [MANIFEST_KEY]: {
            hooks: ["../outside"],
          },
        },
        null,
        2,
      ),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = loadHookEntriesFromDir({ dir: hooksRoot, source: "openclaw-workspace" });
    expect(entries.some((e) => e.hook.name === "outside")).toBe(false);
  });

  it("accepts package.json hook paths within package directory", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-hooks-workspace-ok-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hooksRoot = path.join(root, "hooks");
    fs.mkdirSync(hooksRoot, { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pkgDir = path.join(hooksRoot, "pkg");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nested = path.join(pkgDir, "nested");
    fs.mkdirSync(nested, { recursive: true });

    fs.writeFileSync(path.join(nested, "HOOK.md"), "---\nname: nested\n---\n");
    fs.writeFileSync(path.join(nested, "handler.js"), "export default async () => {};\n");

    fs.writeFileSync(
      path.join(pkgDir, "package.json"),
      JSON.stringify(
        {
          name: "pkg",
          [MANIFEST_KEY]: {
            hooks: ["./nested"],
          },
        },
        null,
        2,
      ),
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = loadHookEntriesFromDir({ dir: hooksRoot, source: "openclaw-workspace" });
    expect(entries.some((e) => e.hook.name === "nested")).toBe(true);
  });

  it("ignores package.json hook paths that escape via symlink", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-hooks-workspace-link-"));
    const hooksRoot = path.join(root, "hooks");
    fs.mkdirSync(hooksRoot, { recursive: true });

    const pkgDir = path.join(hooksRoot, "pkg");
    const outsideDir = path.join(root, "outside");
    const linkedDir = path.join(pkgDir, "linked");
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.mkdirSync(outsideDir, { recursive: true });
    fs.writeFileSync(path.join(outsideDir, "HOOK.md"), "---\nname: outside\n---\n");
    fs.writeFileSync(path.join(outsideDir, "handler.js"), "export default async () => {};\n");
    try {
      fs.symlinkSync(outsideDir, linkedDir, process.platform === "win32" ? "junction" : "dir");
    } catch {
      return;
    }

    fs.writeFileSync(
      path.join(pkgDir, "package.json"),
      JSON.stringify(
        {
          name: "pkg",
          [MANIFEST_KEY]: {
            hooks: ["./linked"],
          },
        },
        null,
        2,
      ),
    );

    const entries = loadHookEntriesFromDir({ dir: hooksRoot, source: "openclaw-workspace" });
    expect(entries.some((e) => e.hook.name === "outside")).toBe(false);
  });
});
