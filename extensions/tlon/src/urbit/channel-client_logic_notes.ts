/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/channel-client.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { LookupFn, SsrFPolicy } from "openclaw/plugin-sdk";
import { ensureUrbitChannelOpen, pokeUrbitChannel, scryUrbitPath } from "./channel-ops.js";
import { getUrbitContext, normalizeUrbitCookie } from "./context.js";
import { urbitFetch } from "./fetch.js";

export type UrbitChannelClientOptions = {
  ship?: string;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class UrbitChannelClient {
  readonly baseUrl: string;
  readonly cookie: string;
  readonly ship: string;
  readonly ssrfPolicy?: SsrFPolicy;
  readonly lookupFn?: LookupFn;
  readonly fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

  private channelId: string | null = null;

  constructor(url: string, cookie: string, options: UrbitChannelClientOptions = {}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = getUrbitContext(url, options.ship);
    this.baseUrl = ctx.baseUrl;
    this.cookie = normalizeUrbitCookie(cookie);
    this.ship = ctx.ship;
    this.ssrfPolicy = options.ssrfPolicy;
    this.lookupFn = options.lookupFn;
    this.fetchImpl = options.fetchImpl;
  }

  private get channelPath(): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = this.channelId;
    if (!id) {
      throw new Error("Channel not opened");
    }
    return `/~/channel/${id}`;
  }

  async open(): Promise<void> {
    if (this.channelId) {
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelId = `${Math.floor(Date.now() / 1000)}-${Math.random().toString(36).substring(2, 8)}`;
    this.channelId = channelId;

    try {
      await ensureUrbitChannelOpen(
        {
          baseUrl: this.baseUrl,
          cookie: this.cookie,
          ship: this.ship,
          channelId,
          ssrfPolicy: this.ssrfPolicy,
          lookupFn: this.lookupFn,
          fetchImpl: this.fetchImpl,
        },
        {
          createBody: [],
          createAuditContext: "tlon-urbit-channel-open",
        },
      );
    } catch (error) {
      this.channelId = null;
      throw error;
    }
  }

  async poke(params: { app: string; mark: string; json: unknown }): Promise<number> {
    await this.open();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelId = this.channelId;
    if (!channelId) {
      throw new Error("Channel not opened");
    }
    return await pokeUrbitChannel(
      {
        baseUrl: this.baseUrl,
        cookie: this.cookie,
        ship: this.ship,
        channelId,
        ssrfPolicy: this.ssrfPolicy,
        lookupFn: this.lookupFn,
        fetchImpl: this.fetchImpl,
      },
      { ...params, auditContext: "tlon-urbit-poke" },
    );
  }

  async scry(path: string): Promise<unknown> {
    return await scryUrbitPath(
      {
        baseUrl: this.baseUrl,
        cookie: this.cookie,
        ssrfPolicy: this.ssrfPolicy,
        lookupFn: this.lookupFn,
        fetchImpl: this.fetchImpl,
      },
      { path, auditContext: "tlon-urbit-scry" },
    );
  }

  async getOurName(): Promise<string> {
    const { response, release } = await urbitFetch({
      baseUrl: this.baseUrl,
      path: "/~/name",
      init: {
        method: "GET",
        headers: { Cookie: this.cookie },
      },
      ssrfPolicy: this.ssrfPolicy,
      lookupFn: this.lookupFn,
      fetchImpl: this.fetchImpl,
      timeoutMs: 30_000,
      auditContext: "tlon-urbit-name",
    });

    try {
      if (!response.ok) {
        throw new Error(`Name request failed: ${response.status}`);
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = await response.text();
      return text.trim();
    } finally {
      await release();
    }
  }

  async close(): Promise<void> {
    if (!this.channelId) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelPath = this.channelPath;
    this.channelId = null;

    try {
      const { response, release } = await urbitFetch({
        baseUrl: this.baseUrl,
        path: channelPath,
        init: { method: "DELETE", headers: { Cookie: this.cookie } },
        ssrfPolicy: this.ssrfPolicy,
        lookupFn: this.lookupFn,
        fetchImpl: this.fetchImpl,
        timeoutMs: 30_000,
        auditContext: "tlon-urbit-channel-close",
      });
      try {
        void response.body?.cancel();
      } finally {
        await release();
      }
    } catch {
      // ignore cleanup errors
    }
  }
}
