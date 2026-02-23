/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled/boot-md/handler.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listAgentIds, resolveAgentWorkspaceDir } from "../../../agents/agent-scope.js";
import { createDefaultDeps } from "../../../cli/deps.js";
import { runBootOnce } from "../../../gateway/boot.js";
import { createSubsystemLogger } from "../../../logging/subsystem.js";
import type { HookHandler } from "../../hooks.js";
import { isGatewayStartupEvent } from "../../internal-hooks.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("hooks/boot-md");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runBootChecklist: HookHandler = async (event) => {
  if (!isGatewayStartupEvent(event)) {
    return;
  }

  if (!event.context.cfg) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = event.context.cfg;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deps = event.context.deps ?? createDefaultDeps();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentIds = listAgentIds(cfg);

  for (const agentId of agentIds) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runBootOnce({ cfg, deps, workspaceDir, agentId });
    if (result.status === "failed") {
      log.warn("boot-md failed for agent startup run", {
        agentId,
        workspaceDir,
        reason: result.reason,
      });
      continue;
    }
    if (result.status === "skipped") {
      log.debug("boot-md skipped for agent startup run", {
        agentId,
        workspaceDir,
        reason: result.reason,
      });
    }
  }
};

export default runBootChecklist;
