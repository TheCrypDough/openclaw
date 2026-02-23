/*
 * AUTO ANNOTATION
 * File: src/browser/client-actions-observe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BrowserActionPathResult, BrowserActionTargetOk } from "./client-actions-types.js";
import { buildProfileQuery, withBaseUrl } from "./client-actions-url.js";
import { fetchBrowserJson } from "./client-fetch.js";
import type {
  BrowserConsoleMessage,
  BrowserNetworkRequest,
  BrowserPageError,
} from "./pw-session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildQuerySuffix(params: Array<[string, string | boolean | undefined]>): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const query = new URLSearchParams();
  for (const [key, value] of params) {
    if (typeof value === "boolean") {
      query.set(key, String(value));
      continue;
    }
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const encoded = query.toString();
  return encoded.length > 0 ? `?${encoded}` : "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function browserConsoleMessages(
  baseUrl: string | undefined,
  opts: { level?: string; targetId?: string; profile?: string } = {},
): Promise<{ ok: true; messages: BrowserConsoleMessage[]; targetId: string }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = buildQuerySuffix([
    ["level", opts.level],
    ["targetId", opts.targetId],
    ["profile", opts.profile],
  ]);
  return await fetchBrowserJson<{
    ok: true;
    messages: BrowserConsoleMessage[];
    targetId: string;
  }>(withBaseUrl(baseUrl, `/console${suffix}`), { timeoutMs: 20000 });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function browserPdfSave(
  baseUrl: string | undefined,
  opts: { targetId?: string; profile?: string } = {},
): Promise<BrowserActionPathResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const q = buildProfileQuery(opts.profile);
  return await fetchBrowserJson<BrowserActionPathResult>(withBaseUrl(baseUrl, `/pdf${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId: opts.targetId }),
    timeoutMs: 20000,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function browserPageErrors(
  baseUrl: string | undefined,
  opts: { targetId?: string; clear?: boolean; profile?: string } = {},
): Promise<{ ok: true; targetId: string; errors: BrowserPageError[] }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = buildQuerySuffix([
    ["targetId", opts.targetId],
    ["clear", typeof opts.clear === "boolean" ? opts.clear : undefined],
    ["profile", opts.profile],
  ]);
  return await fetchBrowserJson<{
    ok: true;
    targetId: string;
    errors: BrowserPageError[];
  }>(withBaseUrl(baseUrl, `/errors${suffix}`), { timeoutMs: 20000 });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function browserRequests(
  baseUrl: string | undefined,
  opts: {
    targetId?: string;
    filter?: string;
    clear?: boolean;
    profile?: string;
  } = {},
): Promise<{ ok: true; targetId: string; requests: BrowserNetworkRequest[] }> {
  const suffix = buildQuerySuffix([
    ["targetId", opts.targetId],
    ["filter", opts.filter],
    ["clear", typeof opts.clear === "boolean" ? opts.clear : undefined],
    ["profile", opts.profile],
  ]);
  return await fetchBrowserJson<{
    ok: true;
    targetId: string;
    requests: BrowserNetworkRequest[];
  }>(withBaseUrl(baseUrl, `/requests${suffix}`), { timeoutMs: 20000 });
}

export async function browserTraceStart(
  baseUrl: string | undefined,
  opts: {
    targetId?: string;
    screenshots?: boolean;
    snapshots?: boolean;
    sources?: boolean;
    profile?: string;
  } = {},
): Promise<BrowserActionTargetOk> {
  const q = buildProfileQuery(opts.profile);
  return await fetchBrowserJson<BrowserActionTargetOk>(withBaseUrl(baseUrl, `/trace/start${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetId: opts.targetId,
      screenshots: opts.screenshots,
      snapshots: opts.snapshots,
      sources: opts.sources,
    }),
    timeoutMs: 20000,
  });
}

export async function browserTraceStop(
  baseUrl: string | undefined,
  opts: { targetId?: string; path?: string; profile?: string } = {},
): Promise<BrowserActionPathResult> {
  const q = buildProfileQuery(opts.profile);
  return await fetchBrowserJson<BrowserActionPathResult>(withBaseUrl(baseUrl, `/trace/stop${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId: opts.targetId, path: opts.path }),
    timeoutMs: 20000,
  });
}

export async function browserHighlight(
  baseUrl: string | undefined,
  opts: { ref: string; targetId?: string; profile?: string },
): Promise<BrowserActionTargetOk> {
  const q = buildProfileQuery(opts.profile);
  return await fetchBrowserJson<BrowserActionTargetOk>(withBaseUrl(baseUrl, `/highlight${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId: opts.targetId, ref: opts.ref }),
    timeoutMs: 20000,
  });
}

export async function browserResponseBody(
  baseUrl: string | undefined,
  opts: {
    url: string;
    targetId?: string;
    timeoutMs?: number;
    maxChars?: number;
    profile?: string;
  },
): Promise<{
  ok: true;
  targetId: string;
  response: {
    url: string;
    status?: number;
    headers?: Record<string, string>;
    body: string;
    truncated?: boolean;
  };
}> {
  const q = buildProfileQuery(opts.profile);
  return await fetchBrowserJson<{
    ok: true;
    targetId: string;
    response: {
      url: string;
      status?: number;
      headers?: Record<string, string>;
      body: string;
      truncated?: boolean;
    };
  }>(withBaseUrl(baseUrl, `/response/body${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetId: opts.targetId,
      url: opts.url,
      timeoutMs: opts.timeoutMs,
      maxChars: opts.maxChars,
    }),
    timeoutMs: 20000,
  });
}
