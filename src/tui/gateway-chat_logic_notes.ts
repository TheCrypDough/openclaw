/*
 * AUTO ANNOTATION
 * File: src/tui/gateway-chat.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { randomUUID } from "node:crypto";
import { loadConfig } from "../config/config.js";
import {
  buildGatewayConnectionDetails,
  ensureExplicitGatewayAuth,
  resolveExplicitGatewayAuth,
} from "../gateway/call.js";
import { GatewayClient } from "../gateway/client.js";
import { GATEWAY_CLIENT_CAPS } from "../gateway/protocol/client-info.js";
import {
  type HelloOk,
  PROTOCOL_VERSION,
  type SessionsListParams,
  type SessionsPatchResult,
  type SessionsPatchParams,
} from "../gateway/protocol/index.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
import { VERSION } from "../version.js";

export type GatewayConnectionOptions = {
  url?: string;
  token?: string;
  password?: string;
};

export type ChatSendOptions = {
  sessionKey: string;
  message: string;
  thinking?: string;
  deliver?: boolean;
  timeoutMs?: number;
  runId?: string;
};

export type GatewayEvent = {
  event: string;
  payload?: unknown;
  seq?: number;
};

export type GatewaySessionList = {
  ts: number;
  path: string;
  count: number;
  defaults?: {
    model?: string | null;
    modelProvider?: string | null;
    contextTokens?: number | null;
  };
  sessions: Array<{
    key: string;
    sessionId?: string;
    updatedAt?: number | null;
    thinkingLevel?: string;
    verboseLevel?: string;
    reasoningLevel?: string;
    sendPolicy?: string;
    model?: string;
    contextTokens?: number | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    totalTokens?: number | null;
    responseUsage?: "on" | "off" | "tokens" | "full";
    modelProvider?: string;
    label?: string;
    displayName?: string;
    provider?: string;
    groupChannel?: string;
    space?: string;
    subject?: string;
    chatType?: string;
    lastProvider?: string;
    lastTo?: string;
    lastAccountId?: string;
    derivedTitle?: string;
    lastMessagePreview?: string;
  }>;
};

export type GatewayAgentsList = {
  defaultId: string;
  mainKey: string;
  scope: "per-sender" | "global";
  agents: Array<{
    id: string;
    name?: string;
  }>;
};

export type GatewayModelChoice = {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  reasoning?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class GatewayChatClient {
  private client: GatewayClient;
  private readyPromise: Promise<void>;
  private resolveReady?: () => void;
  readonly connection: { url: string; token?: string; password?: string };
  hello?: HelloOk;

  onEvent?: (evt: GatewayEvent) => void;
  onConnected?: () => void;
  onDisconnected?: (reason: string) => void;
  onGap?: (info: { expected: number; received: number }) => void;

  constructor(opts: GatewayConnectionOptions) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveGatewayConnection(opts);
    this.connection = resolved;

    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.client = new GatewayClient({
      url: resolved.url,
      token: resolved.token,
      password: resolved.password,
      clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
      clientDisplayName: "openclaw-tui",
      clientVersion: VERSION,
      platform: process.platform,
      mode: GATEWAY_CLIENT_MODES.UI,
      caps: [GATEWAY_CLIENT_CAPS.TOOL_EVENTS],
      instanceId: randomUUID(),
      minProtocol: PROTOCOL_VERSION,
      maxProtocol: PROTOCOL_VERSION,
      onHelloOk: (hello) => {
        this.hello = hello;
        this.resolveReady?.();
        this.onConnected?.();
      },
      onEvent: (evt) => {
        this.onEvent?.({
          event: evt.event,
          payload: evt.payload,
          seq: evt.seq,
        });
      },
      onClose: (_code, reason) => {
        this.onDisconnected?.(reason);
      },
      onGap: (info) => {
        this.onGap?.(info);
      },
    });
  }

  start() {
    this.client.start();
  }

  stop() {
    this.client.stop();
  }

  async waitForReady() {
    await this.readyPromise;
  }

  async sendChat(opts: ChatSendOptions): Promise<{ runId: string }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runId = opts.runId ?? randomUUID();
    await this.client.request("chat.send", {
      sessionKey: opts.sessionKey,
      message: opts.message,
      thinking: opts.thinking,
      deliver: opts.deliver,
      timeoutMs: opts.timeoutMs,
      idempotencyKey: runId,
    });
    return { runId };
  }

  async abortChat(opts: { sessionKey: string; runId: string }) {
    return await this.client.request<{ ok: boolean; aborted: boolean }>("chat.abort", {
      sessionKey: opts.sessionKey,
      runId: opts.runId,
    });
  }

  async loadHistory(opts: { sessionKey: string; limit?: number }) {
    return await this.client.request("chat.history", {
      sessionKey: opts.sessionKey,
      limit: opts.limit,
    });
  }

  async listSessions(opts?: SessionsListParams) {
    return await this.client.request<GatewaySessionList>("sessions.list", {
      limit: opts?.limit,
      activeMinutes: opts?.activeMinutes,
      includeGlobal: opts?.includeGlobal,
      includeUnknown: opts?.includeUnknown,
      includeDerivedTitles: opts?.includeDerivedTitles,
      includeLastMessage: opts?.includeLastMessage,
      agentId: opts?.agentId,
    });
  }

  async listAgents() {
    return await this.client.request<GatewayAgentsList>("agents.list", {});
  }

  async patchSession(opts: SessionsPatchParams): Promise<SessionsPatchResult> {
    return await this.client.request<SessionsPatchResult>("sessions.patch", opts);
  }

  async resetSession(key: string, reason?: "new" | "reset") {
    return await this.client.request("sessions.reset", {
      key,
      ...(reason ? { reason } : {}),
    });
  }

  async getStatus() {
    return await this.client.request("status");
  }

  async listModels(): Promise<GatewayModelChoice[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await this.client.request<{ models?: GatewayModelChoice[] }>("models.list");
    return Array.isArray(res?.models) ? res.models : [];
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGatewayConnection(opts: GatewayConnectionOptions) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isRemoteMode = config.gateway?.mode === "remote";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remote = isRemoteMode ? config.gateway?.remote : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authToken = config.gateway?.auth?.token;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const urlOverride =
    typeof opts.url === "string" && opts.url.trim().length > 0 ? opts.url.trim() : undefined;
  const explicitAuth = resolveExplicitGatewayAuth({ token: opts.token, password: opts.password });
  ensureExplicitGatewayAuth({
    urlOverride,
    auth: explicitAuth,
    errorHint: "Fix: pass --token or --password when using --url.",
  });
  const url = buildGatewayConnectionDetails({
    config,
    ...(urlOverride ? { url: urlOverride } : {}),
  }).url;

  const token =
    explicitAuth.token ||
    (!urlOverride
      ? isRemoteMode
        ? typeof remote?.token === "string" && remote.token.trim().length > 0
          ? remote.token.trim()
          : undefined
        : process.env.OPENCLAW_GATEWAY_TOKEN?.trim() ||
          (typeof authToken === "string" && authToken.trim().length > 0
            ? authToken.trim()
            : undefined)
      : undefined);

  const password =
    explicitAuth.password ||
    (!urlOverride
      ? process.env.OPENCLAW_GATEWAY_PASSWORD?.trim() ||
        (typeof remote?.password === "string" && remote.password.trim().length > 0
          ? remote.password.trim()
          : undefined)
      : undefined);

  return { url, token, password };
}
