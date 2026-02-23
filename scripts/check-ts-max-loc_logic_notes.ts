/*
 * AUTO ANNOTATION
 * File: scripts/check-ts-max-loc.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (check-ts-max-loc.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ParsedArgs = {
  maxLines: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseArgs(argv: string[]): ParsedArgs {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let maxLines = 500;

  for (let index = 0; index < argv.length; index++) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const arg = argv[index];
    if (arg === "--max") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const next = argv[index + 1];
      if (!next || Number.isNaN(Number(next))) {
        throw new Error("Missing/invalid --max value");
      }
      maxLines = Number(next);
      index++;
      continue;
    }
  }

  return { maxLines };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function gitLsFilesAll(): string[] {
  // Include untracked files too so local refactors don’t “pass” by accident.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdout = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8",
  });
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function countLines(filePath: string): Promise<number> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const content = await readFile(filePath, "utf8");
  // Count physical lines. Keeps the rule simple + predictable.
  return content.split("\n").length;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function main() {
  // Makes `... | head` safe.
  process.stdout.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EPIPE") {
      process.exit(0);
    }
    throw error;
  });

  const { maxLines } = parseArgs(process.argv.slice(2));
  const files = gitLsFilesAll()
    .filter((filePath) => existsSync(filePath))
    .filter((filePath) => filePath.endsWith(".ts") || filePath.endsWith(".tsx"));

  const results = await Promise.all(
    files.map(async (filePath) => ({ filePath, lines: await countLines(filePath) })),
  );

  const offenders = results
    .filter((result) => result.lines > maxLines)
    .toSorted((a, b) => b.lines - a.lines);

  if (!offenders.length) {
    return;
  }

  // Minimal, grep-friendly output.
  for (const offender of offenders) {
    // eslint-disable-next-line no-console
    console.log(`${offender.lines}\t${offender.filePath}`);
  }

  process.exitCode = 1;
}

await main();
