/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/reply-elevated.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveAgentConfig } from "../../agents/agent-scope.js";
import { getChannelDock } from "../../channels/dock.js";
import { normalizeChannelId } from "../../channels/plugins/index.js";
import { CHAT_CHANNEL_ORDER } from "../../channels/registry.js";
import type { AgentElevatedAllowFromConfig, OpenClawConfig } from "../../config/config.js";
import { normalizeAtHashSlug } from "../../shared/string-normalization.js";
import { INTERNAL_MESSAGE_CHANNEL } from "../../utils/message-channel.js";
import type { MsgContext } from "../templating.js";
export { formatElevatedUnavailableMessage } from "./elevated-unavailable.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAllowToken(value?: string) {
  if (!value) {
    return "";
  }
  return value.trim().toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function slugAllowToken(value?: string) {
  return normalizeAtHashSlug(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SENDER_PREFIXES = [
  ...CHAT_CHANNEL_ORDER,
  INTERNAL_MESSAGE_CHANNEL,
  "user",
  "group",
  "channel",
];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SENDER_PREFIX_RE = new RegExp(`^(${SENDER_PREFIXES.join("|")}):`, "i");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function stripSenderPrefix(value?: string) {
  if (!value) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  return trimmed.replace(SENDER_PREFIX_RE, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveElevatedAllowList(
  allowFrom: AgentElevatedAllowFromConfig | undefined,
  provider: string,
  fallbackAllowFrom?: Array<string | number>,
): Array<string | number> | undefined {
  if (!allowFrom) {
    return fallbackAllowFrom;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = allowFrom[provider];
  return Array.isArray(value) ? value : fallbackAllowFrom;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isApprovedElevatedSender(params: {
  provider: string;
  ctx: MsgContext;
  allowFrom?: AgentElevatedAllowFromConfig;
  fallbackAllowFrom?: Array<string | number>;
}): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawAllow = resolveElevatedAllowList(
    params.allowFrom,
    params.provider,
    params.fallbackAllowFrom,
  );
  if (!rawAllow || rawAllow.length === 0) {
    return false;
  }

  const allowTokens = rawAllow.map((entry) => String(entry).trim()).filter(Boolean);
  if (allowTokens.length === 0) {
    return false;
  }
  if (allowTokens.some((entry) => entry === "*")) {
    return true;
  }

  const tokens = new Set<string>();
  const addToken = (value?: string) => {
    if (!value) {
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    tokens.add(trimmed);
    const normalized = normalizeAllowToken(trimmed);
    if (normalized) {
      tokens.add(normalized);
    }
    const slugged = slugAllowToken(trimmed);
    if (slugged) {
      tokens.add(slugged);
    }
  };

  addToken(params.ctx.SenderName);
  addToken(params.ctx.SenderUsername);
  addToken(params.ctx.SenderTag);
  addToken(params.ctx.SenderE164);
  addToken(params.ctx.From);
  addToken(stripSenderPrefix(params.ctx.From));
  addToken(params.ctx.To);
  addToken(stripSenderPrefix(params.ctx.To));

  for (const rawEntry of allowTokens) {
    const entry = rawEntry.trim();
    if (!entry) {
      continue;
    }
    const stripped = stripSenderPrefix(entry);
    if (tokens.has(entry) || tokens.has(stripped)) {
      return true;
    }
    const normalized = normalizeAllowToken(stripped);
    if (normalized && tokens.has(normalized)) {
      return true;
    }
    const slugged = slugAllowToken(stripped);
    if (slugged && tokens.has(slugged)) {
      return true;
    }
  }

  return false;
}

export function resolveElevatedPermissions(params: {
  cfg: OpenClawConfig;
  agentId: string;
  ctx: MsgContext;
  provider: string;
}): {
  enabled: boolean;
  allowed: boolean;
  failures: Array<{ gate: string; key: string }>;
} {
  const globalConfig = params.cfg.tools?.elevated;
  const agentConfig = resolveAgentConfig(params.cfg, params.agentId)?.tools?.elevated;
  const globalEnabled = globalConfig?.enabled !== false;
  const agentEnabled = agentConfig?.enabled !== false;
  const enabled = globalEnabled && agentEnabled;
  const failures: Array<{ gate: string; key: string }> = [];
  if (!globalEnabled) {
    failures.push({ gate: "enabled", key: "tools.elevated.enabled" });
  }
  if (!agentEnabled) {
    failures.push({
      gate: "enabled",
      key: "agents.list[].tools.elevated.enabled",
    });
  }
  if (!enabled) {
    return { enabled, allowed: false, failures };
  }
  if (!params.provider) {
    failures.push({ gate: "provider", key: "ctx.Provider" });
    return { enabled, allowed: false, failures };
  }

  const normalizedProvider = normalizeChannelId(params.provider);
  const dockFallbackAllowFrom = normalizedProvider
    ? getChannelDock(normalizedProvider)?.elevated?.allowFromFallback?.({
        cfg: params.cfg,
        accountId: params.ctx.AccountId,
      })
    : undefined;
  const fallbackAllowFrom = dockFallbackAllowFrom;
  const globalAllowed = isApprovedElevatedSender({
    provider: params.provider,
    ctx: params.ctx,
    allowFrom: globalConfig?.allowFrom,
    fallbackAllowFrom,
  });
  if (!globalAllowed) {
    failures.push({
      gate: "allowFrom",
      key: `tools.elevated.allowFrom.${params.provider}`,
    });
    return { enabled, allowed: false, failures };
  }

  const agentAllowed = agentConfig?.allowFrom
    ? isApprovedElevatedSender({
        provider: params.provider,
        ctx: params.ctx,
        allowFrom: agentConfig.allowFrom,
        fallbackAllowFrom,
      })
    : true;
  if (!agentAllowed) {
    failures.push({
      gate: "allowFrom",
      key: `agents.list[].tools.elevated.allowFrom.${params.provider}`,
    });
  }
  return { enabled, allowed: globalAllowed && agentAllowed, failures };
}
