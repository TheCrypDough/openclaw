/*
 * AUTO ANNOTATION
 * File: src/signal/probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "../channels/plugins/types.js";
import { signalCheck, signalRpcRequest } from "./client.js";

export type SignalProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  version?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseSignalVersion(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "object" && value !== null) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const version = (value as { version?: unknown }).version;
    if (typeof version === "string" && version.trim()) {
      return version.trim();
    }
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeSignal(baseUrl: string, timeoutMs: number): Promise<SignalProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: SignalProbe = {
    ok: false,
    status: null,
    error: null,
    elapsedMs: 0,
    version: null,
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const check = await signalCheck(baseUrl, timeoutMs);
  if (!check.ok) {
    return {
      ...result,
      status: check.status ?? null,
      error: check.error ?? "unreachable",
      elapsedMs: Date.now() - started,
    };
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const version = await signalRpcRequest("version", undefined, {
      baseUrl,
      timeoutMs,
    });
    result.version = parseSignalVersion(version);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }
  return {
    ...result,
    ok: true,
    status: check.status ?? null,
    elapsedMs: Date.now() - started,
  };
}
