/*
 * AUTO ANNOTATION
 * File: test/git-hooks-pre-commit.e2e.test.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const run = (cwd: string, cmd: string, args: string[] = []) => {
  return execFileSync(cmd, args, { cwd, encoding: "utf8" }).trim();
};

describe("git-hooks/pre-commit (integration)", () => {
  it("does not treat staged filenames as git-add flags (e.g. --all)", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dir = await mkdtemp(path.join(os.tmpdir(), "openclaw-pre-commit-"));
    run(dir, "git", ["init", "-q"]);

    // Copy the hook + helpers so the test exercises real on-disk wiring.
    await mkdir(path.join(dir, "git-hooks"), { recursive: true });
    await mkdir(path.join(dir, "scripts", "pre-commit"), { recursive: true });
    copyFileSync(
      path.join(process.cwd(), "git-hooks", "pre-commit"),
      path.join(dir, "git-hooks", "pre-commit"),
    );
    copyFileSync(
      path.join(process.cwd(), "scripts", "pre-commit", "run-node-tool.sh"),
      path.join(dir, "scripts", "pre-commit", "run-node-tool.sh"),
    );
    copyFileSync(
      path.join(process.cwd(), "scripts", "pre-commit", "filter-staged-files.mjs"),
      path.join(dir, "scripts", "pre-commit", "filter-staged-files.mjs"),
    );
    chmodSync(path.join(dir, "git-hooks", "pre-commit"), 0o755);
    chmodSync(path.join(dir, "scripts", "pre-commit", "run-node-tool.sh"), 0o755);

    // Create an untracked file that should NOT be staged by the hook.
    await writeFile(path.join(dir, "secret.txt"), "do-not-stage\n");

    // Stage a maliciously-named file. Older hooks using `xargs git add` could run `git add --all`.
    await writeFile(path.join(dir, "--all"), "flag\n");
    run(dir, "git", ["add", "--", "--all"]);

    // Run the hook directly (same logic as when installed via core.hooksPath).
    run(dir, "bash", ["git-hooks/pre-commit"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const staged = run(dir, "git", ["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
    expect(staged).toEqual(["--all"]);
  });
});
