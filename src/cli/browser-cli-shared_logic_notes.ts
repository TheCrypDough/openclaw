/*
 * AUTO ANNOTATION
 * File: src/cli/browser-cli-shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayRpcOpts } from "./gateway-rpc.js";
import { callGatewayFromCli } from "./gateway-rpc.js";

export type BrowserParentOpts = GatewayRpcOpts & {
  json?: boolean;
  browserProfile?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BrowserRequestParams = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeQuery(query: BrowserRequestParams["query"]): Record<string, string> | undefined {
  if (!query) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }
    out[key] = String(value);
  }
  return Object.keys(out).length ? out : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function callBrowserRequest<T>(
  opts: BrowserParentOpts,
  params: BrowserRequestParams,
  extra?: { timeoutMs?: number; progress?: boolean },
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedTimeoutMs =
    typeof extra?.timeoutMs === "number" && Number.isFinite(extra.timeoutMs)
      ? Math.max(1, Math.floor(extra.timeoutMs))
      : typeof opts.timeout === "string"
        ? Number.parseInt(opts.timeout, 10)
        : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedTimeout =
    typeof resolvedTimeoutMs === "number" && Number.isFinite(resolvedTimeoutMs)
      ? resolvedTimeoutMs
      : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeout = typeof resolvedTimeout === "number" ? String(resolvedTimeout) : opts.timeout;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = await callGatewayFromCli(
    "browser.request",
    { ...opts, timeout },
    {
      method: params.method,
      path: params.path,
      query: normalizeQuery(params.query),
      body: params.body,
      timeoutMs: resolvedTimeout,
    },
    { progress: extra?.progress },
  );
  if (payload === undefined) {
    throw new Error("Unexpected browser.request response");
  }
  return payload as T;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function callBrowserResize(
  opts: BrowserParentOpts,
  params: { profile?: string; width: number; height: number; targetId?: string },
  extra?: { timeoutMs?: number },
): Promise<unknown> {
  return callBrowserRequest(
    opts,
    {
      method: "POST",
      path: "/act",
      query: params.profile ? { profile: params.profile } : undefined,
      body: {
        kind: "resize",
        width: params.width,
        height: params.height,
        targetId: params.targetId?.trim() || undefined,
      },
    },
    extra,
  );
}
