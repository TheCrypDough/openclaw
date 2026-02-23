/*
 * AUTO ANNOTATION
 * File: src/commands/cleanup-utils.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it, test } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { buildCleanupPlan } from "./cleanup-utils.js";
import { applyAgentDefaultPrimaryModel } from "./model-default.js";

describe("buildCleanupPlan", () => {
  test("resolves inside-state flags and workspace dirs", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tmpRoot = path.join(path.parse(process.cwd()).root, "tmp");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: { workspace: path.join(tmpRoot, "openclaw-workspace-1") },
        list: [{ workspace: path.join(tmpRoot, "openclaw-workspace-2") }],
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const plan = buildCleanupPlan({
      cfg: cfg as unknown as OpenClawConfig,
      stateDir: path.join(tmpRoot, "openclaw-state"),
      configPath: path.join(tmpRoot, "openclaw-state", "openclaw.json"),
      oauthDir: path.join(tmpRoot, "openclaw-oauth"),
    });

    expect(plan.configInsideState).toBe(true);
    expect(plan.oauthInsideState).toBe(false);
    expect(new Set(plan.workspaceDirs)).toEqual(
      new Set([
        path.join(tmpRoot, "openclaw-workspace-1"),
        path.join(tmpRoot, "openclaw-workspace-2"),
      ]),
    );
  });
});

describe("applyAgentDefaultPrimaryModel", () => {
  it("does not mutate when already set", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { agents: { defaults: { model: { primary: "a/b" } } } } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyAgentDefaultPrimaryModel({ cfg, model: "a/b" });
    expect(result.changed).toBe(false);
    expect(result.next).toBe(cfg);
  });

  it("normalizes legacy models", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { agents: { defaults: { model: { primary: "legacy" } } } } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyAgentDefaultPrimaryModel({
      cfg,
      model: "a/b",
      legacyModels: new Set(["legacy"]),
    });
    expect(result.changed).toBe(false);
    expect(result.next).toBe(cfg);
  });
});
