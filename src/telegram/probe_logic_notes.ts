/*
 * AUTO ANNOTATION
 * File: src/telegram/probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "../channels/plugins/types.js";
import { fetchWithTimeout } from "../utils/fetch-timeout.js";
import { makeProxyFetch } from "./proxy.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TELEGRAM_API_BASE = "https://api.telegram.org";

export type TelegramProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  bot?: {
    id?: number | null;
    username?: string | null;
    canJoinGroups?: boolean | null;
    canReadAllGroupMessages?: boolean | null;
    supportsInlineQueries?: boolean | null;
  };
  webhook?: { url?: string | null; hasCustomCert?: boolean | null };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeTelegram(
  token: string,
  timeoutMs: number,
  proxyUrl?: string,
): Promise<TelegramProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetcher = proxyUrl ? makeProxyFetch(proxyUrl) : fetch;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = `${TELEGRAM_API_BASE}/bot${token}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const retryDelayMs = Math.max(50, Math.min(1000, timeoutMs));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: TelegramProbe = {
    ok: false,
    status: null,
    error: null,
    elapsedMs: 0,
  };

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let meRes: Response | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let fetchError: unknown = null;

    // Retry loop for initial connection (handles network/DNS startup races)
    for (let i = 0; i < 3; i++) {
      try {
        meRes = await fetchWithTimeout(`${base}/getMe`, {}, timeoutMs, fetcher);
        break;
      } catch (err) {
        fetchError = err;
        if (i < 2) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }
    }

    if (!meRes) {
      throw fetchError;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const meJson = (await meRes.json()) as {
      ok?: boolean;
      description?: string;
      result?: {
        id?: number;
        username?: string;
        can_join_groups?: boolean;
        can_read_all_group_messages?: boolean;
        supports_inline_queries?: boolean;
      };
    };
    if (!meRes.ok || !meJson?.ok) {
      result.status = meRes.status;
      result.error = meJson?.description ?? `getMe failed (${meRes.status})`;
      return { ...result, elapsedMs: Date.now() - started };
    }

    result.bot = {
      id: meJson.result?.id ?? null,
      username: meJson.result?.username ?? null,
      canJoinGroups:
        typeof meJson.result?.can_join_groups === "boolean" ? meJson.result?.can_join_groups : null,
      canReadAllGroupMessages:
        typeof meJson.result?.can_read_all_group_messages === "boolean"
          ? meJson.result?.can_read_all_group_messages
          : null,
      supportsInlineQueries:
        typeof meJson.result?.supports_inline_queries === "boolean"
          ? meJson.result?.supports_inline_queries
          : null,
    };

    // Try to fetch webhook info, but don't fail health if it errors.
    try {
      const webhookRes = await fetchWithTimeout(`${base}/getWebhookInfo`, {}, timeoutMs, fetcher);
      const webhookJson = (await webhookRes.json()) as {
        ok?: boolean;
        result?: { url?: string; has_custom_certificate?: boolean };
      };
      if (webhookRes.ok && webhookJson?.ok) {
        result.webhook = {
          url: webhookJson.result?.url ?? null,
          hasCustomCert: webhookJson.result?.has_custom_certificate ?? null,
        };
      }
    } catch {
      // ignore webhook errors for probe
    }

    result.ok = true;
    result.status = null;
    result.error = null;
    result.elapsedMs = Date.now() - started;
    return result;
  } catch (err) {
    return {
      ...result,
      status: err instanceof Response ? err.status : result.status,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - started,
    };
  }
}
