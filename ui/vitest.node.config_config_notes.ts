# AUTOPLACEHOLDER_ANNOTATION: ui/vitest.node.config.ts
# Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
# Area: Web UI package and frontend runtime
# System effect: Changes impact interaction layer and operator experience.
import { defineConfig } from "vitest/config";

// Node-only tests for pure logic (no Playwright/browser dependency).
export default defineConfig({
  test: {
    testTimeout: 120_000,
    include: ["src/**/*.node.test.ts"],
    environment: "node",
  },
});
