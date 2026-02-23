/*
 * AUTO ANNOTATION
 * File: ui/src/ui/tool-display.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  defaultTitle,
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
} from "../../../src/agents/tool-display-common.js";
import type { IconName } from "./icons.ts";
import rawConfig from "./tool-display.json" with { type: "json" };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolDisplaySpec = ToolDisplaySpecBase & {
  icon?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolDisplayConfig = {
  version?: number;
  fallback?: ToolDisplaySpec;
  tools?: Record<string, ToolDisplaySpec>;
};

export type ToolDisplay = {
  name: string;
  icon: IconName;
  title: string;
  label: string;
  verb?: string;
  detail?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TOOL_DISPLAY_CONFIG = rawConfig as ToolDisplayConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const FALLBACK = TOOL_DISPLAY_CONFIG.fallback ?? { icon: "puzzle" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TOOL_MAP = TOOL_DISPLAY_CONFIG.tools ?? {};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shortenHomeInString(input: string): string {
  if (!input) {
    return input;
  }

  // Browser-safe home shortening: avoid importing Node-only helpers (keeps Vite builds working in Docker/CI).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const patterns = [
    { re: /^\/Users\/[^/]+(\/|$)/, replacement: "~$1" }, // macOS
    { re: /^\/home\/[^/]+(\/|$)/, replacement: "~$1" }, // Linux
    { re: /^C:\\Users\\[^\\]+(\\|$)/i, replacement: "~$1" }, // Windows
  ] as const;

  for (const pattern of patterns) {
    if (pattern.re.test(input)) {
      return input.replace(pattern.re, pattern.replacement);
    }
  }

  return input;
}

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
  const icon = (spec?.icon ?? FALLBACK.icon ?? "puzzle") as IconName;
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
      mode: "first",
      coerce: { includeFalse: true, includeZero: true },
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
    icon,
    title,
    label,
    verb,
    detail,
  };
}

export function formatToolDetail(display: ToolDisplay): string | undefined {
  if (!display.detail) {
    return undefined;
  }
  if (display.detail.includes(" · ")) {
    const compact = display.detail
      .split(" · ")
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(", ");
    return compact ? `with ${compact}` : undefined;
  }
  return display.detail;
}

export function formatToolSummary(display: ToolDisplay): string {
  const detail = formatToolDetail(display);
  return detail ? `${display.label}: ${detail}` : display.label;
}
