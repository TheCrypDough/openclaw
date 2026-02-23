/*
 * AUTO ANNOTATION
 * File: src/infra/exec-host.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import { requestJsonlSocket } from "./jsonl-socket.js";

export type ExecHostRequest = {
  command: string[];
  rawCommand?: string | null;
  cwd?: string | null;
  env?: Record<string, string> | null;
  timeoutMs?: number | null;
  needsScreenRecording?: boolean | null;
  agentId?: string | null;
  sessionKey?: string | null;
  approvalDecision?: "allow-once" | "allow-always" | null;
};

export type ExecHostRunResult = {
  exitCode?: number;
  timedOut: boolean;
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string | null;
};

export type ExecHostError = {
  code: string;
  message: string;
  reason?: string;
};

export type ExecHostResponse =
  | { ok: true; payload: ExecHostRunResult }
  | { ok: false; error: ExecHostError };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function requestExecHostViaSocket(params: {
  socketPath: string;
  token: string;
  request: ExecHostRequest;
  timeoutMs?: number;
}): Promise<ExecHostResponse | null> {
  const { socketPath, token, request } = params;
  if (!socketPath || !token) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeoutMs = params.timeoutMs ?? 20_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestJson = JSON.stringify(request);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nonce = crypto.randomBytes(16).toString("hex");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ts = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hmac = crypto
    .createHmac("sha256", token)
    .update(`${nonce}:${ts}:${requestJson}`)
    .digest("hex");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = JSON.stringify({
    type: "exec",
    id: crypto.randomUUID(),
    nonce,
    ts,
    hmac,
    requestJson,
  });

  return await requestJsonlSocket({
    socketPath,
    payload,
    timeoutMs,
    accept: (value) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const msg = value as { type?: string; ok?: boolean; payload?: unknown; error?: unknown };
      if (msg?.type !== "exec-res") {
        return undefined;
      }
      if (msg.ok === true && msg.payload) {
        return { ok: true, payload: msg.payload as ExecHostRunResult };
      }
      if (msg.ok === false && msg.error) {
        return { ok: false, error: msg.error as ExecHostError };
      }
      return null;
    },
  });
}
