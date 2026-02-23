/*
 * AUTO ANNOTATION
 * File: src/commands/status-all/agents.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { resolveAgentWorkspaceDir } from "../../agents/agent-scope.js";
import type { OpenClawConfig } from "../../config/config.js";
import { loadSessionStore, resolveStorePath } from "../../config/sessions.js";
import { listAgentsForGateway } from "../../gateway/session-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getAgentLocalStatuses(cfg: OpenClawConfig) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentList = listAgentsForGateway(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agents = await Promise.all(
    agentList.agents.map(async (agent) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const workspaceDir = (() => {
        try {
          return resolveAgentWorkspaceDir(cfg, agent.id);
        } catch {
          return null;
        }
      })();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const bootstrapPending =
        workspaceDir != null ? await fileExists(path.join(workspaceDir, "BOOTSTRAP.md")) : null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionsPath = resolveStorePath(cfg.session?.store, {
        agentId: agent.id,
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const store = (() => {
        try {
          return loadSessionStore(sessionsPath);
        } catch {
          return {};
        }
      })();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const updatedAt = Object.values(store).reduce(
        (max, entry) => Math.max(max, entry?.updatedAt ?? 0),
        0,
      );
      const lastUpdatedAt = updatedAt > 0 ? updatedAt : null;
      const lastActiveAgeMs = lastUpdatedAt ? now - lastUpdatedAt : null;
      const sessionsCount = Object.keys(store).filter(
        (k) => k !== "global" && k !== "unknown",
      ).length;
      return {
        id: agent.id,
        name: agent.name,
        workspaceDir,
        bootstrapPending,
        sessionsPath,
        sessionsCount,
        lastUpdatedAt,
        lastActiveAgeMs,
      };
    }),
  );

  const totalSessions = agents.reduce((sum, a) => sum + a.sessionsCount, 0);
  const bootstrapPendingCount = agents.reduce((sum, a) => sum + (a.bootstrapPending ? 1 : 0), 0);
  return {
    defaultId: agentList.defaultId,
    agents,
    totalSessions,
    bootstrapPendingCount,
  };
}
