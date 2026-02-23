/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/agent-skills.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayBrowserClient } from "../gateway.ts";
import type { SkillStatusReport } from "../types.ts";

export type AgentSkillsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentSkillsLoading: boolean;
  agentSkillsError: string | null;
  agentSkillsReport: SkillStatusReport | null;
  agentSkillsAgentId: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadAgentSkills(state: AgentSkillsState, agentId: string) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.agentSkillsLoading) {
    return;
  }
  state.agentSkillsLoading = true;
  state.agentSkillsError = null;
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await state.client.request("skills.status", { agentId });
    if (res) {
      state.agentSkillsReport = res as SkillStatusReport;
      state.agentSkillsAgentId = agentId;
    }
  } catch (err) {
    state.agentSkillsError = String(err);
  } finally {
    state.agentSkillsLoading = false;
  }
}
