/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled/boot-md/handler.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InternalHookEvent } from "../../internal-hooks.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runBootOnce = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const listAgentIds = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveAgentWorkspaceDir = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logWarn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logDebug = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAIN_WORKSPACE_DIR = path.join(path.sep, "ws", "main");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPS_WORKSPACE_DIR = path.join(path.sep, "ws", "ops");

vi.mock("../../../gateway/boot.js", () => ({ runBootOnce }));
vi.mock("../../../agents/agent-scope.js", () => ({
  listAgentIds,
  resolveAgentWorkspaceDir,
}));
vi.mock("../../../logging/subsystem.js", () => ({
  createSubsystemLogger: () => ({
    warn: logWarn,
    debug: logDebug,
  }),
}));

const { default: runBootChecklist } = await import("./handler.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeEvent(overrides?: Partial<InternalHookEvent>): InternalHookEvent {
  return {
    type: "gateway",
    action: "startup",
    sessionKey: "test",
    context: {},
    timestamp: new Date(),
    messages: [],
    ...overrides,
  };
}

describe("boot-md handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logWarn.mockReset();
    logDebug.mockReset();
  });

  it("skips non-gateway events", async () => {
    await runBootChecklist(makeEvent({ type: "command", action: "new" }));
    expect(runBootOnce).not.toHaveBeenCalled();
  });

  it("skips non-startup actions", async () => {
    await runBootChecklist(makeEvent({ action: "shutdown" }));
    expect(runBootOnce).not.toHaveBeenCalled();
  });

  it("skips when cfg is missing from context", async () => {
    await runBootChecklist(makeEvent({ context: { workspaceDir: "/tmp" } }));
    expect(runBootOnce).not.toHaveBeenCalled();
  });

  it("runs boot for each agent", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { agents: { list: [{ id: "main" }, { id: "ops" }] } };
    listAgentIds.mockReturnValue(["main", "ops"]);
    resolveAgentWorkspaceDir.mockImplementation((_cfg: unknown, id: string) =>
      id === "main" ? MAIN_WORKSPACE_DIR : OPS_WORKSPACE_DIR,
    );
    runBootOnce.mockResolvedValue({ status: "ran" });

    await runBootChecklist(makeEvent({ context: { cfg } }));

    expect(listAgentIds).toHaveBeenCalledWith(cfg);
    expect(runBootOnce).toHaveBeenCalledTimes(2);
    expect(runBootOnce).toHaveBeenCalledWith(
      expect.objectContaining({ cfg, workspaceDir: MAIN_WORKSPACE_DIR, agentId: "main" }),
    );
    expect(runBootOnce).toHaveBeenCalledWith(
      expect.objectContaining({ cfg, workspaceDir: OPS_WORKSPACE_DIR, agentId: "ops" }),
    );
  });

  it("runs boot for single default agent when no agents configured", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {};
    listAgentIds.mockReturnValue(["main"]);
    resolveAgentWorkspaceDir.mockReturnValue(MAIN_WORKSPACE_DIR);
    runBootOnce.mockResolvedValue({ status: "skipped", reason: "missing" });

    await runBootChecklist(makeEvent({ context: { cfg } }));

    expect(runBootOnce).toHaveBeenCalledTimes(1);
    expect(runBootOnce).toHaveBeenCalledWith(
      expect.objectContaining({ cfg, workspaceDir: MAIN_WORKSPACE_DIR, agentId: "main" }),
    );
  });

  it("logs warning details when a per-agent boot run fails", async () => {
    const cfg = { agents: { list: [{ id: "main" }, { id: "ops" }] } };
    listAgentIds.mockReturnValue(["main", "ops"]);
    resolveAgentWorkspaceDir.mockImplementation((_cfg: unknown, id: string) =>
      id === "main" ? MAIN_WORKSPACE_DIR : OPS_WORKSPACE_DIR,
    );
    runBootOnce
      .mockResolvedValueOnce({ status: "ran" })
      .mockResolvedValueOnce({ status: "failed", reason: "agent failed" });

    await runBootChecklist(makeEvent({ context: { cfg } }));

    expect(logWarn).toHaveBeenCalledTimes(1);
    expect(logWarn).toHaveBeenCalledWith("boot-md failed for agent startup run", {
      agentId: "ops",
      workspaceDir: OPS_WORKSPACE_DIR,
      reason: "agent failed",
    });
  });

  it("logs debug details when a per-agent boot run is skipped", async () => {
    const cfg = { agents: { list: [{ id: "main" }] } };
    listAgentIds.mockReturnValue(["main"]);
    resolveAgentWorkspaceDir.mockReturnValue(MAIN_WORKSPACE_DIR);
    runBootOnce.mockResolvedValue({ status: "skipped", reason: "missing" });

    await runBootChecklist(makeEvent({ context: { cfg } }));

    expect(logDebug).toHaveBeenCalledWith("boot-md skipped for agent startup run", {
      agentId: "main",
      workspaceDir: MAIN_WORKSPACE_DIR,
      reason: "missing",
    });
  });
});
