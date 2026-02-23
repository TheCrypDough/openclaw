/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec.script-preflight.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createExecTool } from "./bash-tools.exec.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isWin = process.platform === "win32";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeNonWin = isWin ? describe.skip : describe;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withTempDir(prefix: string, run: (dir: string) => Promise<void>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

describeNonWin("exec script preflight", () => {
  it("blocks shell env var injection tokens in python scripts before execution", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const pyPath = path.join(tmp, "bad.py");

      await fs.writeFile(
        pyPath,
        [
          "import json",
          "# model accidentally wrote shell syntax:",
          "payload = $DM_JSON",
          "print(payload)",
        ].join("\n"),
        "utf-8",
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call1", {
          command: "python bad.py",
          workdir: tmp,
        }),
      ).rejects.toThrow(/exec preflight: detected likely shell variable injection \(\$DM_JSON\)/);
    });
  });

  it("blocks obvious shell-as-js output before node execution", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const jsPath = path.join(tmp, "bad.js");

      await fs.writeFile(
        jsPath,
        ['NODE "$TMPDIR/hot.json"', "console.log('hi')"].join("\n"),
        "utf-8",
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      await expect(
        tool.execute("call1", {
          command: "node bad.js",
          workdir: tmp,
        }),
      ).rejects.toThrow(
        /exec preflight: (detected likely shell variable injection|JS file starts with shell syntax)/,
      );
    });
  });

  it("skips preflight when script token is quoted and unresolved by fast parser", async () => {
    await withTempDir("openclaw-exec-preflight-", async (tmp) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const jsPath = path.join(tmp, "bad.js");
      await fs.writeFile(jsPath, "const value = $DM_JSON;", "utf-8");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });
      const result = await tool.execute("call-quoted", {
        command: 'node "bad.js"',
        workdir: tmp,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).not.toMatch(/exec preflight:/);
    });
  });

  it("skips preflight file reads for script paths outside the workdir", async () => {
    await withTempDir("openclaw-exec-preflight-parent-", async (parent) => {
      const outsidePath = path.join(parent, "outside.js");
      const workdir = path.join(parent, "workdir");
      await fs.mkdir(workdir, { recursive: true });
      await fs.writeFile(outsidePath, "const value = $DM_JSON;", "utf-8");

      const tool = createExecTool({ host: "gateway", security: "full", ask: "off" });

      const result = await tool.execute("call-outside", {
        command: "node ../outside.js",
        workdir,
      });
      const text = result.content.find((block) => block.type === "text")?.text ?? "";
      expect(text).not.toMatch(/exec preflight:/);
    });
  });
});
