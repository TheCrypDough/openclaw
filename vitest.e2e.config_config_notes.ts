# AUTOPLACEHOLDER_ANNOTATION: vitest.e2e.config.ts
# Purpose: File in vitest.e2e.config.ts area for project orchestration/configuration/data.
# Area: A repository component with localized responsibility
# System effect: Change can influence a repository component with localized responsibility and therefore affects build/runtime behavior indirectly.
import os from "node:os";
import { defineConfig } from "vitest/config";
import baseConfig from "./vitest.config.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const base = baseConfig as unknown as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const cpuCount = os.cpus().length;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const defaultWorkers = isCI
  ? Math.min(4, Math.max(2, Math.floor(cpuCount * 0.5)))
  : Math.min(8, Math.max(4, Math.floor(cpuCount * 0.6)));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const requestedWorkers = Number.parseInt(process.env.OPENCLAW_E2E_WORKERS ?? "", 10);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const e2eWorkers =
  Number.isFinite(requestedWorkers) && requestedWorkers > 0
    ? Math.min(16, requestedWorkers)
    : defaultWorkers;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const verboseE2E = process.env.OPENCLAW_E2E_VERBOSE === "1";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseTest = (baseConfig as { test?: { exclude?: string[] } }).test ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const exclude = (baseTest.exclude ?? []).filter((p) => p !== "**/*.e2e.test.ts");

export default defineConfig({
  ...base,
  test: {
    ...baseTest,
    pool: "vmForks",
    maxWorkers: e2eWorkers,
    silent: !verboseE2E,
    include: ["test/**/*.e2e.test.ts", "src/**/*.e2e.test.ts"],
    exclude,
  },
});
