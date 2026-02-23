/*
 * AUTO ANNOTATION
 * File: src/acp/session-mapper.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayClient } from "../gateway/client.js";
import { readBool, readString } from "./meta.js";
import type { AcpServerOptions } from "./types.js";

export type AcpSessionMeta = {
  sessionKey?: string;
  sessionLabel?: string;
  resetSession?: boolean;
  requireExisting?: boolean;
  prefixCwd?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSessionMeta(meta: unknown): AcpSessionMeta {
  if (!meta || typeof meta !== "object") {
    return {};
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = meta as Record<string, unknown>;
  return {
    sessionKey: readString(record, ["sessionKey", "session", "key"]),
    sessionLabel: readString(record, ["sessionLabel", "label"]),
    resetSession: readBool(record, ["resetSession", "reset"]),
    requireExisting: readBool(record, ["requireExistingSession", "requireExisting"]),
    prefixCwd: readBool(record, ["prefixCwd"]),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveSessionKey(params: {
  meta: AcpSessionMeta;
  fallbackKey: string;
  gateway: GatewayClient;
  opts: AcpServerOptions;
}): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestedLabel = params.meta.sessionLabel ?? params.opts.defaultSessionLabel;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestedKey = params.meta.sessionKey ?? params.opts.defaultSessionKey;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requireExisting =
    params.meta.requireExisting ?? params.opts.requireExistingSession ?? false;

  if (params.meta.sessionLabel) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await params.gateway.request<{ ok: true; key: string }>("sessions.resolve", {
      label: params.meta.sessionLabel,
    });
    if (!resolved?.key) {
      throw new Error(`Unable to resolve session label: ${params.meta.sessionLabel}`);
    }
    return resolved.key;
  }

  if (params.meta.sessionKey) {
    if (!requireExisting) {
      return params.meta.sessionKey;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await params.gateway.request<{ ok: true; key: string }>("sessions.resolve", {
      key: params.meta.sessionKey,
    });
    if (!resolved?.key) {
      throw new Error(`Session key not found: ${params.meta.sessionKey}`);
    }
    return resolved.key;
  }

  if (requestedLabel) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await params.gateway.request<{ ok: true; key: string }>("sessions.resolve", {
      label: requestedLabel,
    });
    if (!resolved?.key) {
      throw new Error(`Unable to resolve session label: ${requestedLabel}`);
    }
    return resolved.key;
  }

  if (requestedKey) {
    if (!requireExisting) {
      return requestedKey;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await params.gateway.request<{ ok: true; key: string }>("sessions.resolve", {
      key: requestedKey,
    });
    if (!resolved?.key) {
      throw new Error(`Session key not found: ${requestedKey}`);
    }
    return resolved.key;
  }

  return params.fallbackKey;
}

export async function resetSessionIfNeeded(params: {
  meta: AcpSessionMeta;
  sessionKey: string;
  gateway: GatewayClient;
  opts: AcpServerOptions;
}): Promise<void> {
  const resetSession = params.meta.resetSession ?? params.opts.resetSession ?? false;
  if (!resetSession) {
    return;
  }
  await params.gateway.request("sessions.reset", { key: params.sessionKey });
}
