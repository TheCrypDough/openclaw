/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled/boot-md/handler.gateway-startup.integration.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveAgentWorkspaceDir } from "../../../agents/agent-scope.js";
import type { CliDeps } from "../../../cli/deps.js";
import type { OpenClawConfig } from "../../../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runBootOnce = vi.fn();

vi.mock("../../../gateway/boot.js", () => ({ runBootOnce }));
vi.mock("../../../logging/subsystem.js", () => ({
  createSubsystemLogger: () => ({
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}));

const { default: runBootChecklist } = await import("./handler.js");
const { clearInternalHooks, createInternalHookEvent, registerInternalHook, triggerInternalHook } =
  await import("../../internal-hooks.js");

describe("boot-md startup hook integration", () => {
  beforeEach(() => {
    runBootOnce.mockReset();
    clearInternalHooks();
  });

  afterEach(() => {
    clearInternalHooks();
  });

  it("dispatches gateway:startup through internal hooks and runs BOOT for each configured agent scope", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      hooks: { internal: { enabled: true } },
      agents: {
        list: [
          { id: "main", default: true, workspace: "/ws/main" },
          { id: "ops", workspace: "/ws/ops" },
        ],
      },
    } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps = {} as CliDeps;
    runBootOnce.mockResolvedValue({ status: "ran" });

    registerInternalHook("gateway:startup", runBootChecklist);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const event = createInternalHookEvent("gateway", "startup", "gateway:startup", { cfg, deps });
    await triggerInternalHook(event);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mainWorkspaceDir = resolveAgentWorkspaceDir(cfg, "main");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const opsWorkspaceDir = resolveAgentWorkspaceDir(cfg, "ops");

    expect(runBootOnce).toHaveBeenCalledTimes(2);
    expect(runBootOnce).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cfg, deps, workspaceDir: mainWorkspaceDir, agentId: "main" }),
    );
    expect(runBootOnce).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cfg, deps, workspaceDir: opsWorkspaceDir, agentId: "ops" }),
    );
  });
});
