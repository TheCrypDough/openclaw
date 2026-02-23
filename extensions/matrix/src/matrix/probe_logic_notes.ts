/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/probe.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "openclaw/plugin-sdk";
import { createMatrixClient, isBunRuntime } from "./client.js";

export type MatrixProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  userId?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeMatrix(params: {
  homeserver: string;
  accessToken: string;
  userId?: string;
  timeoutMs: number;
}): Promise<MatrixProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: MatrixProbe = {
    ok: false,
    status: null,
    error: null,
    elapsedMs: 0,
  };
  if (isBunRuntime()) {
    return {
      ...result,
      error: "Matrix probe requires Node (bun runtime not supported)",
      elapsedMs: Date.now() - started,
    };
  }
  if (!params.homeserver?.trim()) {
    return {
      ...result,
      error: "missing homeserver",
      elapsedMs: Date.now() - started,
    };
  }
  if (!params.accessToken?.trim()) {
    return {
      ...result,
      error: "missing access token",
      elapsedMs: Date.now() - started,
    };
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = await createMatrixClient({
      homeserver: params.homeserver,
      userId: params.userId ?? "",
      accessToken: params.accessToken,
      localTimeoutMs: params.timeoutMs,
    });
    // @vector-im/matrix-bot-sdk uses getUserId() which calls whoami internally
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const userId = await client.getUserId();
    result.ok = true;
    result.userId = userId ?? null;

    result.elapsedMs = Date.now() - started;
    return result;
  } catch (err) {
    return {
      ...result,
      status:
        typeof err === "object" && err && "statusCode" in err
          ? Number((err as { statusCode?: number }).statusCode)
          : result.status,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - started,
    };
  }
}
