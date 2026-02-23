/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/agent-identity.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayBrowserClient } from "../gateway.ts";
import type { AgentIdentityResult } from "../types.ts";

export type AgentIdentityState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentIdentityLoading: boolean;
  agentIdentityError: string | null;
  agentIdentityById: Record<string, AgentIdentityResult>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadAgentIdentity(state: AgentIdentityState, agentId: string) {
  if (!state.client || !state.connected || state.agentIdentityLoading) {
    return;
  }
  if (state.agentIdentityById[agentId]) {
    return;
  }
  state.agentIdentityLoading = true;
  state.agentIdentityError = null;
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await state.client.request<AgentIdentityResult | null>("agent.identity.get", {
      agentId,
    });
    if (res) {
      state.agentIdentityById = { ...state.agentIdentityById, [agentId]: res };
    }
  } catch (err) {
    state.agentIdentityError = String(err);
  } finally {
    state.agentIdentityLoading = false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadAgentIdentities(state: AgentIdentityState, agentIds: string[]) {
  if (!state.client || !state.connected || state.agentIdentityLoading) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const missing = agentIds.filter((id) => !state.agentIdentityById[id]);
  if (missing.length === 0) {
    return;
  }
  state.agentIdentityLoading = true;
  state.agentIdentityError = null;
  try {
    for (const agentId of missing) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await state.client.request<AgentIdentityResult | null>("agent.identity.get", {
        agentId,
      });
      if (res) {
        state.agentIdentityById = { ...state.agentIdentityById, [agentId]: res };
      }
    }
  } catch (err) {
    state.agentIdentityError = String(err);
  } finally {
    state.agentIdentityLoading = false;
  }
}
