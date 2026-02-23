# AUTOPLACEHOLDER_ANNOTATION: vitest.unit.config.ts
# Purpose: File in vitest.unit.config.ts area for project orchestration/configuration/data.
# Area: A repository component with localized responsibility
# System effect: Change can influence a repository component with localized responsibility and therefore affects build/runtime behavior indirectly.
import { defineConfig } from "vitest/config";
import baseConfig from "./vitest.config.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const base = baseConfig as unknown as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseTest = (baseConfig as { test?: { include?: string[]; exclude?: string[] } }).test ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const include = (
  baseTest.include ?? ["src/**/*.test.ts", "extensions/**/*.test.ts", "test/format-error.test.ts"]
).filter((pattern) => !pattern.includes("extensions/"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const exclude = baseTest.exclude ?? [];

export default defineConfig({
  ...base,
  test: {
    ...baseTest,
    include,
    exclude: [...exclude, "src/gateway/**", "extensions/**"],
  },
});
