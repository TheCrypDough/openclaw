/*
 * AUTO ANNOTATION
 * File: src/agents/tool-display.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { redactToolDetail } from "../logging/redact.js";
import { shortenHomeInString } from "../utils.js";
import {
  defaultTitle,
  formatDetailKey,
  normalizeToolName,
  normalizeVerb,
  resolveActionSpec,
  resolveDetailFromKeys,
  resolveExecDetail,
  resolveReadDetail,
  resolveWebFetchDetail,
  resolveWebSearchDetail,
  resolveWriteDetail,
  type ToolDisplaySpec as ToolDisplaySpecBase,
} from "./tool-display-common.js";
import TOOL_DISPLAY_JSON from "./tool-display.json" with { type: "json" };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolDisplaySpec = ToolDisplaySpecBase & {
  emoji?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolDisplayConfig = {
  version?: number;
  fallback?: ToolDisplaySpec;
  tools?: Record<string, ToolDisplaySpec>;
};

export type ToolDisplay = {
  name: string;
  emoji: string;
  title: string;
  label: string;
  verb?: string;
  detail?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TOOL_DISPLAY_CONFIG = TOOL_DISPLAY_JSON as ToolDisplayConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const FALLBACK = TOOL_DISPLAY_CONFIG.fallback ?? { emoji: "🧩" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TOOL_MAP = TOOL_DISPLAY_CONFIG.tools ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DETAIL_LABEL_OVERRIDES: Record<string, string> = {
  agentId: "agent",
  sessionKey: "session",
  targetId: "target",
  targetUrl: "url",
  nodeId: "node",
  requestId: "request",
  messageId: "message",
  threadId: "thread",
  channelId: "channel",
  guildId: "guild",
  userId: "user",
  runTimeoutSeconds: "timeout",
  timeoutSeconds: "timeout",
  includeTools: "tools",
  pollQuestion: "poll",
  maxChars: "max chars",
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_DETAIL_ENTRIES = 8;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveToolDisplay(params: {
  name?: string;
  args?: unknown;
  meta?: string;
}): ToolDisplay {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = normalizeToolName(params.name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = name.toLowerCase();
  const spec = TOOL_MAP[key];
  const emoji = spec?.emoji ?? FALLBACK.emoji ?? "🧩";
  const title = spec?.title ?? defaultTitle(name);
  const label = spec?.label ?? title;
  const actionRaw =
    params.args && typeof params.args === "object"
      ? ((params.args as Record<string, unknown>).action as string | undefined)
      : undefined;
  const action = typeof actionRaw === "string" ? actionRaw.trim() : undefined;
  const actionSpec = resolveActionSpec(spec, action);
  const fallbackVerb =
    key === "web_search"
      ? "search"
      : key === "web_fetch"
        ? "fetch"
        : key.replace(/_/g, " ").replace(/\./g, " ");
  const verb = normalizeVerb(actionSpec?.label ?? action ?? fallbackVerb);

  let detail: string | undefined;
  if (key === "exec") {
    detail = resolveExecDetail(params.args);
  }
  if (!detail && key === "read") {
    detail = resolveReadDetail(params.args);
  }
  if (!detail && (key === "write" || key === "edit" || key === "attach")) {
    detail = resolveWriteDetail(key, params.args);
  }

  if (!detail && key === "web_search") {
    detail = resolveWebSearchDetail(params.args);
  }

  if (!detail && key === "web_fetch") {
    detail = resolveWebFetchDetail(params.args);
  }

  const detailKeys = actionSpec?.detailKeys ?? spec?.detailKeys ?? FALLBACK.detailKeys ?? [];
  if (!detail && detailKeys.length > 0) {
    detail = resolveDetailFromKeys(params.args, detailKeys, {
      mode: "summary",
      maxEntries: MAX_DETAIL_ENTRIES,
      formatKey: (raw) => formatDetailKey(raw, DETAIL_LABEL_OVERRIDES),
    });
  }

  if (!detail && params.meta) {
    detail = params.meta;
  }

  if (detail) {
    detail = shortenHomeInString(detail);
  }

  return {
    name,
    emoji,
    title,
    label,
    verb,
    detail,
  };
}

export function formatToolDetail(display: ToolDisplay): string | undefined {
  const detailRaw = display.detail ? redactToolDetail(display.detail) : undefined;
  if (!detailRaw) {
    return undefined;
  }
  if (detailRaw.includes(" · ")) {
    const compact = detailRaw
      .split(" · ")
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(", ");
    return compact ? `with ${compact}` : undefined;
  }
  return detailRaw;
}

export function formatToolSummary(display: ToolDisplay): string {
  const detail = formatToolDetail(display);
  return detail
    ? `${display.emoji} ${display.label}: ${detail}`
    : `${display.emoji} ${display.label}`;
}
