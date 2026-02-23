/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/channel-ops.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { LookupFn, SsrFPolicy } from "openclaw/plugin-sdk";
import { UrbitHttpError } from "./errors.js";
import { urbitFetch } from "./fetch.js";

export type UrbitChannelDeps = {
  baseUrl: string;
  cookie: string;
  ship: string;
  channelId: string;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function pokeUrbitChannel(
  deps: UrbitChannelDeps,
  params: { app: string; mark: string; json: unknown; auditContext: string },
): Promise<number> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pokeId = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pokeData = {
    id: pokeId,
    action: "poke",
    ship: deps.ship,
    app: params.app,
    mark: params.mark,
    json: params.json,
  };

  const { response, release } = await urbitFetch({
    baseUrl: deps.baseUrl,
    path: `/~/channel/${deps.channelId}`,
    init: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: deps.cookie,
      },
      body: JSON.stringify([pokeData]),
    },
    ssrfPolicy: deps.ssrfPolicy,
    lookupFn: deps.lookupFn,
    fetchImpl: deps.fetchImpl,
    timeoutMs: 30_000,
    auditContext: params.auditContext,
  });

  try {
    if (!response.ok && response.status !== 204) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const errorText = await response.text().catch(() => "");
      throw new Error(`Poke failed: ${response.status}${errorText ? ` - ${errorText}` : ""}`);
    }
    return pokeId;
  } finally {
    await release();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function scryUrbitPath(
  deps: Pick<UrbitChannelDeps, "baseUrl" | "cookie" | "ssrfPolicy" | "lookupFn" | "fetchImpl">,
  params: { path: string; auditContext: string },
): Promise<unknown> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scryPath = `/~/scry${params.path}`;
  const { response, release } = await urbitFetch({
    baseUrl: deps.baseUrl,
    path: scryPath,
    init: {
      method: "GET",
      headers: { Cookie: deps.cookie },
    },
    ssrfPolicy: deps.ssrfPolicy,
    lookupFn: deps.lookupFn,
    fetchImpl: deps.fetchImpl,
    timeoutMs: 30_000,
    auditContext: params.auditContext,
  });

  try {
    if (!response.ok) {
      throw new Error(`Scry failed: ${response.status} for path ${params.path}`);
    }
    return await response.json();
  } finally {
    await release();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createUrbitChannel(
  deps: UrbitChannelDeps,
  params: { body: unknown; auditContext: string },
): Promise<void> {
  const { response, release } = await urbitFetch({
    baseUrl: deps.baseUrl,
    path: `/~/channel/${deps.channelId}`,
    init: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: deps.cookie,
      },
      body: JSON.stringify(params.body),
    },
    ssrfPolicy: deps.ssrfPolicy,
    lookupFn: deps.lookupFn,
    fetchImpl: deps.fetchImpl,
    timeoutMs: 30_000,
    auditContext: params.auditContext,
  });

  try {
    if (!response.ok && response.status !== 204) {
      throw new UrbitHttpError({ operation: "Channel creation", status: response.status });
    }
  } finally {
    await release();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function wakeUrbitChannel(deps: UrbitChannelDeps): Promise<void> {
  const { response, release } = await urbitFetch({
    baseUrl: deps.baseUrl,
    path: `/~/channel/${deps.channelId}`,
    init: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: deps.cookie,
      },
      body: JSON.stringify([
        {
          id: Date.now(),
          action: "poke",
          ship: deps.ship,
          app: "hood",
          mark: "helm-hi",
          json: "Opening API channel",
        },
      ]),
    },
    ssrfPolicy: deps.ssrfPolicy,
    lookupFn: deps.lookupFn,
    fetchImpl: deps.fetchImpl,
    timeoutMs: 30_000,
    auditContext: "tlon-urbit-channel-wake",
  });

  try {
    if (!response.ok && response.status !== 204) {
      throw new UrbitHttpError({ operation: "Channel activation", status: response.status });
    }
  } finally {
    await release();
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureUrbitChannelOpen(
  deps: UrbitChannelDeps,
  params: { createBody: unknown; createAuditContext: string },
): Promise<void> {
  await createUrbitChannel(deps, {
    body: params.createBody,
    auditContext: params.createAuditContext,
  });
  await wakeUrbitChannel(deps);
}
