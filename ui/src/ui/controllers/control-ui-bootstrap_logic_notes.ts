/*
 * AUTO ANNOTATION
 * File: ui/src/ui/controllers/control-ui-bootstrap.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  CONTROL_UI_BOOTSTRAP_CONFIG_PATH,
  type ControlUiBootstrapConfig,
} from "../../../../src/gateway/control-ui-contract.js";
import { normalizeAssistantIdentity } from "../assistant-identity.ts";
import { normalizeBasePath } from "../navigation.ts";

export type ControlUiBootstrapState = {
  basePath: string;
  assistantName: string;
  assistantAvatar: string | null;
  assistantAgentId: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadControlUiBootstrapConfig(state: ControlUiBootstrapState) {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof fetch !== "function") {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const basePath = normalizeBasePath(state.basePath ?? "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = basePath
    ? `${basePath}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`
    : CONTROL_UI_BOOTSTRAP_CONFIG_PATH;

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    if (!res.ok) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = (await res.json()) as ControlUiBootstrapConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeAssistantIdentity({
      agentId: parsed.assistantAgentId ?? null,
      name: parsed.assistantName,
      avatar: parsed.assistantAvatar ?? null,
    });
    state.assistantName = normalized.name;
    state.assistantAvatar = normalized.avatar;
    state.assistantAgentId = normalized.agentId ?? null;
  } catch {
    // Ignore bootstrap failures; UI will update identity after connecting.
  }
}
