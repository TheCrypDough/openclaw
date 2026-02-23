/*
 * AUTO ANNOTATION
 * File: src/plugins/enable.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { enablePluginInConfig } from "./enable.js";

describe("enablePluginInConfig", () => {
  it("enables a plugin entry", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = enablePluginInConfig(cfg, "google-antigravity-auth");
    expect(result.enabled).toBe(true);
    expect(result.config.plugins?.entries?.["google-antigravity-auth"]?.enabled).toBe(true);
  });

  it("adds plugin to allowlist when allowlist is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      plugins: {
        allow: ["memory-core"],
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = enablePluginInConfig(cfg, "google-antigravity-auth");
    expect(result.enabled).toBe(true);
    expect(result.config.plugins?.allow).toEqual(["memory-core", "google-antigravity-auth"]);
  });

  it("refuses enable when plugin is denylisted", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      plugins: {
        deny: ["google-antigravity-auth"],
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = enablePluginInConfig(cfg, "google-antigravity-auth");
    expect(result.enabled).toBe(false);
    expect(result.reason).toBe("blocked by denylist");
  });
});
