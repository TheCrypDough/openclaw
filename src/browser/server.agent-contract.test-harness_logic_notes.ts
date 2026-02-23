/*
 * AUTO ANNOTATION
 * File: src/browser/server.agent-contract.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { fetch as realFetch } from "undici";
import {
  getBrowserControlServerBaseUrl,
  installBrowserControlServerHooks,
  startBrowserControlServerFromConfig,
} from "./server.control-server.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installAgentContractHooks() {
  installBrowserControlServerHooks();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startServerAndBase(): Promise<string> {
  await startBrowserControlServerFromConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = getBrowserControlServerBaseUrl();
  await realFetch(`${base}/start`, { method: "POST" }).then((r) => r.json());
  return base;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function postJson<T>(url: string, body?: unknown): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await realFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return (await res.json()) as T;
}
