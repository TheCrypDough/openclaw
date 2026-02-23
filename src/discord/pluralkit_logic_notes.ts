/*
 * AUTO ANNOTATION
 * File: src/discord/pluralkit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveFetch } from "../infra/fetch.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PLURALKIT_API_BASE = "https://api.pluralkit.me/v2";

export type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};

export type PluralKitSystemInfo = {
  id: string;
  name?: string | null;
  tag?: string | null;
};

export type PluralKitMemberInfo = {
  id: string;
  name?: string | null;
  display_name?: string | null;
};

export type PluralKitMessageInfo = {
  id: string;
  original?: string | null;
  sender?: string | null;
  system?: PluralKitSystemInfo | null;
  member?: PluralKitMemberInfo | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchPluralKitMessageInfo(params: {
  messageId: string;
  config?: DiscordPluralKitConfig;
  fetcher?: typeof fetch;
}): Promise<PluralKitMessageInfo | null> {
  if (!params.config?.enabled) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchImpl = resolveFetch(params.fetcher);
  if (!fetchImpl) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers: Record<string, string> = {};
  if (params.config.token?.trim()) {
    headers.Authorization = params.config.token.trim();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await fetchImpl(`${PLURALKIT_API_BASE}/messages/${params.messageId}`, {
    headers,
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await res.text().catch(() => "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const detail = text.trim() ? `: ${text.trim()}` : "";
    throw new Error(`PluralKit API failed (${res.status})${detail}`);
  }
  return (await res.json()) as PluralKitMessageInfo;
}
