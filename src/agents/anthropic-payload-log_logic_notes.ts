/*
 * AUTO ANNOTATION
 * File: src/agents/anthropic-payload-log.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import path from "node:path";
import type { AgentMessage, StreamFn } from "@mariozechner/pi-agent-core";
import type { Api, Model } from "@mariozechner/pi-ai";
import { resolveStateDir } from "../config/paths.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { resolveUserPath } from "../utils.js";
import { parseBooleanValue } from "../utils/boolean.js";
import { safeJsonStringify } from "../utils/safe-json.js";
import { getQueuedFileWriter, type QueuedFileWriter } from "./queued-file-writer.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PayloadLogStage = "request" | "usage";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PayloadLogEvent = {
  ts: string;
  stage: PayloadLogStage;
  runId?: string;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  modelId?: string;
  modelApi?: string | null;
  workspaceDir?: string;
  payload?: unknown;
  usage?: Record<string, unknown>;
  error?: string;
  payloadDigest?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PayloadLogConfig = {
  enabled: boolean;
  filePath: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PayloadLogWriter = QueuedFileWriter;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const writers = new Map<string, PayloadLogWriter>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("agent/anthropic-payload");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePayloadLogConfig(env: NodeJS.ProcessEnv): PayloadLogConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enabled = parseBooleanValue(env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG) ?? false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileOverride = env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG_FILE?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = fileOverride
    ? resolveUserPath(fileOverride)
    : path.join(resolveStateDir(env), "logs", "anthropic-payload.jsonl");
  return { enabled, filePath };
}

function getWriter(filePath: string): PayloadLogWriter {
  return getQueuedFileWriter(writers, filePath);
}

function formatError(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") {
    return String(error);
  }
  if (error && typeof error === "object") {
    return safeJsonStringify(error) ?? "unknown error";
  }
  return undefined;
}

function digest(value: unknown): string | undefined {
  const serialized = safeJsonStringify(value);
  if (!serialized) {
    return undefined;
  }
  return crypto.createHash("sha256").update(serialized).digest("hex");
}

function isAnthropicModel(model: Model<Api> | undefined | null): boolean {
  return (model as { api?: unknown })?.api === "anthropic-messages";
}

function findLastAssistantUsage(messages: AgentMessage[]): Record<string, unknown> | null {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i] as { role?: unknown; usage?: unknown };
    if (msg?.role === "assistant" && msg.usage && typeof msg.usage === "object") {
      return msg.usage as Record<string, unknown>;
    }
  }
  return null;
}

export type AnthropicPayloadLogger = {
  enabled: true;
  wrapStreamFn: (streamFn: StreamFn) => StreamFn;
  recordUsage: (messages: AgentMessage[], error?: unknown) => void;
};

export function createAnthropicPayloadLogger(params: {
  env?: NodeJS.ProcessEnv;
  runId?: string;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  modelId?: string;
  modelApi?: string | null;
  workspaceDir?: string;
}): AnthropicPayloadLogger | null {
  const env = params.env ?? process.env;
  const cfg = resolvePayloadLogConfig(env);
  if (!cfg.enabled) {
    return null;
  }

  const writer = getWriter(cfg.filePath);
  const base: Omit<PayloadLogEvent, "ts" | "stage"> = {
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    workspaceDir: params.workspaceDir,
  };

  const record = (event: PayloadLogEvent) => {
    const line = safeJsonStringify(event);
    if (!line) {
      return;
    }
    writer.write(`${line}\n`);
  };

  const wrapStreamFn: AnthropicPayloadLogger["wrapStreamFn"] = (streamFn) => {
    const wrapped: StreamFn = (model, context, options) => {
      if (!isAnthropicModel(model)) {
        return streamFn(model, context, options);
      }
      const nextOnPayload = (payload: unknown) => {
        record({
          ...base,
          ts: new Date().toISOString(),
          stage: "request",
          payload,
          payloadDigest: digest(payload),
        });
        options?.onPayload?.(payload);
      };
      return streamFn(model, context, {
        ...options,
        onPayload: nextOnPayload,
      });
    };
    return wrapped;
  };

  const recordUsage: AnthropicPayloadLogger["recordUsage"] = (messages, error) => {
    const usage = findLastAssistantUsage(messages);
    const errorMessage = formatError(error);
    if (!usage) {
      if (errorMessage) {
        record({
          ...base,
          ts: new Date().toISOString(),
          stage: "usage",
          error: errorMessage,
        });
      }
      return;
    }
    record({
      ...base,
      ts: new Date().toISOString(),
      stage: "usage",
      usage,
      error: errorMessage,
    });
    log.info("anthropic usage", {
      runId: params.runId,
      sessionId: params.sessionId,
      usage,
    });
  };

  log.info("anthropic payload logger enabled", { filePath: writer.filePath });
  return { enabled: true, wrapStreamFn, recordUsage };
}
