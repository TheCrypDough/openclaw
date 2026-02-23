/*
 * AUTO ANNOTATION
 * File: src/agents/tools/agent-step.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import { callGateway } from "../../gateway/call.js";
import { INTERNAL_MESSAGE_CHANNEL } from "../../utils/message-channel.js";
import { AGENT_LANE_NESTED } from "../lanes.js";
import { extractAssistantText, stripToolMessages } from "./sessions-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readLatestAssistantReply(params: {
  sessionKey: string;
  limit?: number;
}): Promise<string | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const history = await callGateway<{ messages: Array<unknown> }>({
    method: "chat.history",
    params: { sessionKey: params.sessionKey, limit: params.limit ?? 50 },
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filtered = stripToolMessages(Array.isArray(history?.messages) ? history.messages : []);
  for (let i = filtered.length - 1; i >= 0; i -= 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidate = filtered[i];
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    if ((candidate as { role?: unknown }).role !== "assistant") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = extractAssistantText(candidate);
    if (!text?.trim()) {
      continue;
    }
    return text;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runAgentStep(params: {
  sessionKey: string;
  message: string;
  extraSystemPrompt: string;
  timeoutMs: number;
  channel?: string;
  lane?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
}): Promise<string | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stepIdem = crypto.randomUUID();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const response = await callGateway<{ runId?: string }>({
    method: "agent",
    params: {
      message: params.message,
      sessionKey: params.sessionKey,
      idempotencyKey: stepIdem,
      deliver: false,
      channel: params.channel ?? INTERNAL_MESSAGE_CHANNEL,
      lane: params.lane ?? AGENT_LANE_NESTED,
      extraSystemPrompt: params.extraSystemPrompt,
      inputProvenance: {
        kind: "inter_session",
        sourceSessionKey: params.sourceSessionKey,
        sourceChannel: params.sourceChannel,
        sourceTool: params.sourceTool ?? "sessions_send",
      },
    },
    timeoutMs: 10_000,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stepRunId = typeof response?.runId === "string" && response.runId ? response.runId : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedRunId = stepRunId || stepIdem;
  const stepWaitMs = Math.min(params.timeoutMs, 60_000);
  const wait = await callGateway<{ status?: string }>({
    method: "agent.wait",
    params: {
      runId: resolvedRunId,
      timeoutMs: stepWaitMs,
    },
    timeoutMs: stepWaitMs + 2000,
  });
  if (wait?.status !== "ok") {
    return undefined;
  }
  return await readLatestAssistantReply({ sessionKey: params.sessionKey });
}
