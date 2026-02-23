# AUTOPLACEHOLDER_ANNOTATION: src/config/config.hooks-module-paths.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { validateConfigObjectWithPlugins } from "./config.js";

describe("config hooks module paths", () => {
  it("rejects absolute hooks.mappings[].transform.module", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObjectWithPlugins({
      agents: { list: [{ id: "pi" }] },
      hooks: {
        mappings: [
          {
            match: { path: "custom" },
            action: "agent",
            transform: { module: "/tmp/transform.mjs" },
          },
        ],
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((iss) => iss.path === "hooks.mappings.0.transform.module")).toBe(true);
    }
  });

  it("rejects escaping hooks.mappings[].transform.module", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObjectWithPlugins({
      agents: { list: [{ id: "pi" }] },
      hooks: {
        mappings: [
          {
            match: { path: "custom" },
            action: "agent",
            transform: { module: "../escape.mjs" },
          },
        ],
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((iss) => iss.path === "hooks.mappings.0.transform.module")).toBe(true);
    }
  });

  it("rejects absolute hooks.internal.handlers[].module", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObjectWithPlugins({
      agents: { list: [{ id: "pi" }] },
      hooks: {
        internal: {
          enabled: true,
          handlers: [{ event: "command:new", module: "/tmp/handler.mjs" }],
        },
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((iss) => iss.path === "hooks.internal.handlers.0.module")).toBe(true);
    }
  });
});
