/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/broadcast.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { loadConfig } from "../../../config/config.js";
import type { resolveAgentRoute } from "../../../routing/resolve-route.js";
import { buildAgentSessionKey } from "../../../routing/resolve-route.js";
import {
  buildAgentMainSessionKey,
  DEFAULT_MAIN_KEY,
  normalizeAgentId,
} from "../../../routing/session-key.js";
import { formatError } from "../../session.js";
import { whatsappInboundLog } from "../loggers.js";
import type { WebInboundMsg } from "../types.js";
import type { GroupHistoryEntry } from "./process-message.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function maybeBroadcastMessage(params: {
  cfg: ReturnType<typeof loadConfig>;
  msg: WebInboundMsg;
  peerId: string;
  route: ReturnType<typeof resolveAgentRoute>;
  groupHistoryKey: string;
  groupHistories: Map<string, GroupHistoryEntry[]>;
  processMessage: (
    msg: WebInboundMsg,
    route: ReturnType<typeof resolveAgentRoute>,
    groupHistoryKey: string,
    opts?: {
      groupHistory?: GroupHistoryEntry[];
      suppressGroupHistoryClear?: boolean;
    },
  ) => Promise<boolean>;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const broadcastAgents = params.cfg.broadcast?.[params.peerId];
  if (!broadcastAgents || !Array.isArray(broadcastAgents)) {
    return false;
  }
  if (broadcastAgents.length === 0) {
    return false;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const strategy = params.cfg.broadcast?.strategy || "parallel";
  whatsappInboundLog.info(`Broadcasting message to ${broadcastAgents.length} agents (${strategy})`);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentIds = params.cfg.agents?.list?.map((agent) => normalizeAgentId(agent.id));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasKnownAgents = (agentIds?.length ?? 0) > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupHistorySnapshot =
    params.msg.chatType === "group"
      ? (params.groupHistories.get(params.groupHistoryKey) ?? [])
      : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const processForAgent = async (agentId: string): Promise<boolean> => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizedAgentId = normalizeAgentId(agentId);
    if (hasKnownAgents && !agentIds?.includes(normalizedAgentId)) {
      whatsappInboundLog.warn(`Broadcast agent ${agentId} not found in agents.list; skipping`);
      return false;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentRoute = {
      ...params.route,
      agentId: normalizedAgentId,
      sessionKey: buildAgentSessionKey({
        agentId: normalizedAgentId,
        channel: "whatsapp",
        accountId: params.route.accountId,
        peer: {
          kind: params.msg.chatType === "group" ? "group" : "direct",
          id: params.peerId,
        },
        dmScope: params.cfg.session?.dmScope,
        identityLinks: params.cfg.session?.identityLinks,
      }),
      mainSessionKey: buildAgentMainSessionKey({
        agentId: normalizedAgentId,
        mainKey: DEFAULT_MAIN_KEY,
      }),
    };

    try {
      return await params.processMessage(params.msg, agentRoute, params.groupHistoryKey, {
        groupHistory: groupHistorySnapshot,
        suppressGroupHistoryClear: true,
      });
    } catch (err) {
      whatsappInboundLog.error(`Broadcast agent ${agentId} failed: ${formatError(err)}`);
      return false;
    }
  };

  if (strategy === "sequential") {
    for (const agentId of broadcastAgents) {
      await processForAgent(agentId);
    }
  } else {
    await Promise.allSettled(broadcastAgents.map(processForAgent));
  }

  if (params.msg.chatType === "group") {
    params.groupHistories.set(params.groupHistoryKey, []);
  }

  return true;
}
