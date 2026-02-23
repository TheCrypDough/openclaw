/*
 * AUTO ANNOTATION
 * File: src/agents/workspace-run.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveStateDir } from "../config/paths.js";
import { resolveRunWorkspaceDir } from "./workspace-run.js";
import { resolveDefaultAgentWorkspaceDir } from "./workspace.js";

describe("resolveRunWorkspaceDir", () => {
  it("resolves explicit workspace values without fallback", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const explicit = path.join(process.cwd(), "tmp", "workspace-run-explicit");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRunWorkspaceDir({
      workspaceDir: explicit,
      sessionKey: "agent:main:subagent:test",
    });

    expect(result.usedFallback).toBe(false);
    expect(result.agentId).toBe("main");
    expect(result.workspaceDir).toBe(path.resolve(explicit));
  });

  it("falls back to configured per-agent workspace when input is missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const defaultWorkspace = path.join(process.cwd(), "tmp", "workspace-default-main");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const researchWorkspace = path.join(process.cwd(), "tmp", "workspace-research");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: { workspace: defaultWorkspace },
        list: [{ id: "research", workspace: researchWorkspace }],
      },
    } satisfies OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRunWorkspaceDir({
      workspaceDir: undefined,
      sessionKey: "agent:research:subagent:test",
      config: cfg,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.fallbackReason).toBe("missing");
    expect(result.agentId).toBe("research");
    expect(result.workspaceDir).toBe(path.resolve(researchWorkspace));
  });

  it("falls back to default workspace for blank strings", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const defaultWorkspace = path.join(process.cwd(), "tmp", "workspace-default-main");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      agents: {
        defaults: { workspace: defaultWorkspace },
      },
    } satisfies OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRunWorkspaceDir({
      workspaceDir: "   ",
      sessionKey: "agent:main:subagent:test",
      config: cfg,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.fallbackReason).toBe("blank");
    expect(result.agentId).toBe("main");
    expect(result.workspaceDir).toBe(path.resolve(defaultWorkspace));
  });

  it("falls back to built-in main workspace when config is unavailable", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRunWorkspaceDir({
      workspaceDir: null,
      sessionKey: "agent:main:subagent:test",
      config: undefined,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.fallbackReason).toBe("missing");
    expect(result.agentId).toBe("main");
    expect(result.workspaceDir).toBe(path.resolve(resolveDefaultAgentWorkspaceDir(process.env)));
  });

  it("throws for malformed agent session keys", () => {
    expect(() =>
      resolveRunWorkspaceDir({
        workspaceDir: undefined,
        sessionKey: "agent::broken",
        config: undefined,
      }),
    ).toThrow("Malformed agent session key");
  });

  it("uses explicit agent id for per-agent fallback when config is unavailable", () => {
    const result = resolveRunWorkspaceDir({
      workspaceDir: undefined,
      sessionKey: "definitely-not-a-valid-session-key",
      agentId: "research",
      config: undefined,
    });

    expect(result.agentId).toBe("research");
    expect(result.agentIdSource).toBe("explicit");
    expect(result.workspaceDir).toBe(
      path.resolve(resolveStateDir(process.env), "workspace-research"),
    );
  });

  it("throws for malformed agent session keys even when config has a default agent", () => {
    const mainWorkspace = path.join(process.cwd(), "tmp", "workspace-main-default");
    const researchWorkspace = path.join(process.cwd(), "tmp", "workspace-research-default");
    const cfg = {
      agents: {
        defaults: { workspace: mainWorkspace },
        list: [
          { id: "main", workspace: mainWorkspace },
          { id: "research", workspace: researchWorkspace, default: true },
        ],
      },
    } satisfies OpenClawConfig;

    expect(() =>
      resolveRunWorkspaceDir({
        workspaceDir: undefined,
        sessionKey: "agent::broken",
        config: cfg,
      }),
    ).toThrow("Malformed agent session key");
  });

  it("treats non-agent legacy keys as default, not malformed", () => {
    const fallbackWorkspace = path.join(process.cwd(), "tmp", "workspace-default-legacy");
    const cfg = {
      agents: {
        defaults: { workspace: fallbackWorkspace },
      },
    } satisfies OpenClawConfig;

    const result = resolveRunWorkspaceDir({
      workspaceDir: undefined,
      sessionKey: "custom-main-key",
      config: cfg,
    });

    expect(result.agentId).toBe("main");
    expect(result.agentIdSource).toBe("default");
    expect(result.workspaceDir).toBe(path.resolve(fallbackWorkspace));
  });
});
