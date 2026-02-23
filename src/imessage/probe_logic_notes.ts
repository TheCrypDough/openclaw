/*
 * AUTO ANNOTATION
 * File: src/imessage/probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "../channels/plugins/types.js";
import { detectBinary } from "../commands/onboard-helpers.js";
import { loadConfig } from "../config/config.js";
import { runCommandWithTimeout } from "../process/exec.js";
import type { RuntimeEnv } from "../runtime.js";
import { createIMessageRpcClient } from "./client.js";
import { DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS } from "./constants.js";

// Re-export for backwards compatibility
export { DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS } from "./constants.js";

export type IMessageProbe = BaseProbeResult & {
  fatal?: boolean;
};

export type IMessageProbeOptions = {
  cliPath?: string;
  dbPath?: string;
  runtime?: RuntimeEnv;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RpcSupportResult = {
  supported: boolean;
  error?: string;
  fatal?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rpcSupportCache = new Map<string, RpcSupportResult>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function probeRpcSupport(cliPath: string, timeoutMs: number): Promise<RpcSupportResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = rpcSupportCache.get(cliPath);
  if (cached) {
    return cached;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runCommandWithTimeout([cliPath, "rpc", "--help"], { timeoutMs });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const combined = `${result.stdout}\n${result.stderr}`.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = combined.toLowerCase();
    if (normalized.includes("unknown command") && normalized.includes("rpc")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const fatal = {
        supported: false,
        fatal: true,
        error: 'imsg CLI does not support the "rpc" subcommand (update imsg)',
      };
      rpcSupportCache.set(cliPath, fatal);
      return fatal;
    }
    if (result.code === 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const supported = { supported: true };
      rpcSupportCache.set(cliPath, supported);
      return supported;
    }
    return {
      supported: false,
      error: combined || `imsg rpc --help failed (code ${String(result.code ?? "unknown")})`,
    };
  } catch (err) {
    return { supported: false, error: String(err) };
  }
}

/**
 * Probe iMessage RPC availability.
 * @param timeoutMs - Explicit timeout in ms. If undefined, uses config or default.
 * @param opts - Additional options (cliPath, dbPath, runtime).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeIMessage(
  timeoutMs?: number,
  opts: IMessageProbeOptions = {},
): Promise<IMessageProbe> {
  const cfg = opts.cliPath || opts.dbPath ? undefined : loadConfig();
  const cliPath = opts.cliPath?.trim() || cfg?.channels?.imessage?.cliPath?.trim() || "imsg";
  const dbPath = opts.dbPath?.trim() || cfg?.channels?.imessage?.dbPath?.trim();
  // Use explicit timeout if provided, otherwise fall back to config, then default
  const effectiveTimeout =
    timeoutMs ?? cfg?.channels?.imessage?.probeTimeoutMs ?? DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS;

  const detected = await detectBinary(cliPath);
  if (!detected) {
    return { ok: false, error: `imsg not found (${cliPath})` };
  }

  const rpcSupport = await probeRpcSupport(cliPath, effectiveTimeout);
  if (!rpcSupport.supported) {
    return {
      ok: false,
      error: rpcSupport.error ?? "imsg rpc unavailable",
      fatal: rpcSupport.fatal,
    };
  }

  const client = await createIMessageRpcClient({
    cliPath,
    dbPath,
    runtime: opts.runtime,
  });
  try {
    await client.request("chats.list", { limit: 1 }, { timeoutMs: effectiveTimeout });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.stop();
  }
}
