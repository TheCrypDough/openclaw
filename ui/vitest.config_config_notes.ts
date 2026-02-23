# AUTOPLACEHOLDER_ANNOTATION: ui/vitest.config.ts
# Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
# Area: Web UI package and frontend runtime
# System effect: Changes impact interaction layer and operator experience.
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium", name: "chromium" }],
      headless: true,
      ui: false,
    },
  },
});
