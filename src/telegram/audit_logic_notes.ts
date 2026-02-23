/*
 * AUTO ANNOTATION
 * File: src/telegram/audit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { TelegramGroupConfig } from "../config/types.js";
import { isRecord } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TELEGRAM_API_BASE = "https://api.telegram.org";

export type TelegramGroupMembershipAuditEntry = {
  chatId: string;
  ok: boolean;
  status?: string | null;
  error?: string | null;
  matchKey?: string;
  matchSource?: "id";
};

export type TelegramGroupMembershipAudit = {
  ok: boolean;
  checkedGroups: number;
  unresolvedGroups: number;
  hasWildcardUnmentionedGroups: boolean;
  groups: TelegramGroupMembershipAuditEntry[];
  elapsedMs: number;
};

type TelegramApiOk<T> = { ok: true; result: T };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TelegramApiErr = { ok: false; description?: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectTelegramUnmentionedGroupIds(
  groups: Record<string, TelegramGroupConfig> | undefined,
) {
  if (!groups || typeof groups !== "object") {
    return {
      groupIds: [] as string[],
      unresolvedGroups: 0,
      hasWildcardUnmentionedGroups: false,
    };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasWildcardUnmentionedGroups =
    Boolean(groups["*"]?.requireMention === false) && groups["*"]?.enabled !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupIds: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let unresolvedGroups = 0;
  for (const [key, value] of Object.entries(groups)) {
    if (key === "*") {
      continue;
    }
    if (!value || typeof value !== "object") {
      continue;
    }
    if (value.enabled === false) {
      continue;
    }
    if (value.requireMention !== false) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = String(key).trim();
    if (!id) {
      continue;
    }
    if (/^-?\d+$/.test(id)) {
      groupIds.push(id);
    } else {
      unresolvedGroups += 1;
    }
  }
  groupIds.sort((a, b) => a.localeCompare(b));
  return { groupIds, unresolvedGroups, hasWildcardUnmentionedGroups };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function auditTelegramGroupMembership(params: {
  token: string;
  botId: number;
  groupIds: string[];
  proxyUrl?: string;
  timeoutMs: number;
}): Promise<TelegramGroupMembershipAudit> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = params.token?.trim() ?? "";
  if (!token || params.groupIds.length === 0) {
    return {
      ok: true,
      checkedGroups: 0,
      unresolvedGroups: 0,
      hasWildcardUnmentionedGroups: false,
      groups: [],
      elapsedMs: Date.now() - started,
    };
  }

  // Lazy import to avoid pulling `undici` (ProxyAgent) into cold-path callers that only need
  // `collectTelegramUnmentionedGroupIds` (e.g. config audits).
  const fetcher = params.proxyUrl
    ? (await import("./proxy.js")).makeProxyFetch(params.proxyUrl)
    : fetch;
  const { fetchWithTimeout } = await import("../utils/fetch-timeout.js");
  const base = `${TELEGRAM_API_BASE}/bot${token}`;
  const groups: TelegramGroupMembershipAuditEntry[] = [];

  for (const chatId of params.groupIds) {
    try {
      const url = `${base}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(String(params.botId))}`;
      const res = await fetchWithTimeout(url, {}, params.timeoutMs, fetcher);
      const json = (await res.json()) as TelegramApiOk<{ status?: string }> | TelegramApiErr;
      if (!res.ok || !isRecord(json) || !json.ok) {
        const desc =
          isRecord(json) && !json.ok && typeof json.description === "string"
            ? json.description
            : `getChatMember failed (${res.status})`;
        groups.push({
          chatId,
          ok: false,
          status: null,
          error: desc,
          matchKey: chatId,
          matchSource: "id",
        });
        continue;
      }
      const status = isRecord((json as TelegramApiOk<unknown>).result)
        ? ((json as TelegramApiOk<{ status?: string }>).result.status ?? null)
        : null;
      const ok = status === "creator" || status === "administrator" || status === "member";
      groups.push({
        chatId,
        ok,
        status,
        error: ok ? null : "bot not in group",
        matchKey: chatId,
        matchSource: "id",
      });
    } catch (err) {
      groups.push({
        chatId,
        ok: false,
        status: null,
        error: err instanceof Error ? err.message : String(err),
        matchKey: chatId,
        matchSource: "id",
      });
    }
  }

  return {
    ok: groups.every((g) => g.ok),
    checkedGroups: groups.length,
    unresolvedGroups: 0,
    hasWildcardUnmentionedGroups: false,
    groups,
    elapsedMs: Date.now() - started,
  };
}
