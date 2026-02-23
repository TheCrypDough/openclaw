/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec-approval-request.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ExecAsk, ExecSecurity } from "../infra/exec-approvals.js";
import {
  DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS,
  DEFAULT_APPROVAL_TIMEOUT_MS,
} from "./bash-tools.exec-runtime.js";
import { callGatewayTool } from "./tools/gateway.js";

export type RequestExecApprovalDecisionParams = {
  id: string;
  command: string;
  cwd: string;
  host: "gateway" | "node";
  security: ExecSecurity;
  ask: ExecAsk;
  agentId?: string;
  resolvedPath?: string;
  sessionKey?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function requestExecApprovalDecision(
  params: RequestExecApprovalDecisionParams,
): Promise<string | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const decisionResult = await callGatewayTool<{ decision: string }>(
    "exec.approval.request",
    { timeoutMs: DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS },
    {
      id: params.id,
      command: params.command,
      cwd: params.cwd,
      host: params.host,
      security: params.security,
      ask: params.ask,
      agentId: params.agentId,
      resolvedPath: params.resolvedPath,
      sessionKey: params.sessionKey,
      timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS,
    },
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const decisionValue =
    decisionResult && typeof decisionResult === "object"
      ? (decisionResult as { decision?: unknown }).decision
      : undefined;
  return typeof decisionValue === "string" ? decisionValue : null;
}
