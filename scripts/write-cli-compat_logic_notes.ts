/*
 * AUTO ANNOTATION
 * File: scripts/write-cli-compat.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (write-cli-compat.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEGACY_DAEMON_CLI_EXPORTS,
  resolveLegacyDaemonCliAccessors,
} from "../src/cli/daemon-cli-compat.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const distDir = path.join(rootDir, "dist");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const cliDir = path.join(distDir, "cli");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const findCandidates = () =>
  fs.readdirSync(distDir).filter((entry) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const isDaemonCliBundle =
      entry === "daemon-cli.js" || entry === "daemon-cli.mjs" || entry.startsWith("daemon-cli-");
    if (!isDaemonCliBundle) {
      return false;
    }
    // tsdown can emit either .js or .mjs depending on bundler settings/runtime.
    return entry.endsWith(".js") || entry.endsWith(".mjs");
  });

// In rare cases, build output can land slightly after this script starts (depending on FS timing).
// Retry briefly to avoid flaky builds.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let candidates = findCandidates();
for (let i = 0; i < 10 && candidates.length === 0; i++) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  candidates = findCandidates();
}

if (candidates.length === 0) {
  throw new Error("No daemon-cli bundle found in dist; cannot write legacy CLI shim.");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const orderedCandidates = candidates.toSorted();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolved = orderedCandidates
  .map((entry) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const source = fs.readFileSync(path.join(distDir, entry), "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accessors = resolveLegacyDaemonCliAccessors(source);
    return { entry, accessors };
  })
  .find((entry) => Boolean(entry.accessors));

if (!resolved?.accessors) {
  throw new Error(
    `Could not resolve daemon-cli export aliases from dist bundles: ${orderedCandidates.join(", ")}`,
  );
}

const target = resolved.entry;
const relPath = `../${target}`;
const { accessors } = resolved;
const missingExportError = (name: string) =>
  `Legacy daemon CLI export "${name}" is unavailable in this build. Please upgrade OpenClaw.`;
const buildExportLine = (name: (typeof LEGACY_DAEMON_CLI_EXPORTS)[number]) => {
  const accessor = accessors[name];
  if (accessor) {
    return `export const ${name} = daemonCli.${accessor};`;
  }
  if (name === "registerDaemonCli") {
    return `export const ${name} = () => { throw new Error(${JSON.stringify(missingExportError(name))}); };`;
  }
  return `export const ${name} = async () => { throw new Error(${JSON.stringify(missingExportError(name))}); };`;
};

const contents =
  "// Legacy shim for pre-tsdown update-cli imports.\n" +
  `import * as daemonCli from "${relPath}";\n` +
  LEGACY_DAEMON_CLI_EXPORTS.map(buildExportLine).join("\n") +
  "\n";

fs.mkdirSync(cliDir, { recursive: true });
fs.writeFileSync(path.join(cliDir, "daemon-cli.js"), contents);
