/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/monitor-helpers.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
export { createDedupeCache, rawDataToString } from "openclaw/plugin-sdk";

export type ResponsePrefixContext = {
  model?: string;
  modelFull?: string;
  provider?: string;
  thinkingLevel?: string;
  identityName?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractShortModelName(fullModel: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slash = fullModel.lastIndexOf("/");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelPart = slash >= 0 ? fullModel.slice(slash + 1) : fullModel;
  return modelPart.replace(/-\d{8}$/, "").replace(/-latest$/, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatInboundFromLabel(params: {
  isGroup: boolean;
  groupLabel?: string;
  groupId?: string;
  directLabel: string;
  directId?: string;
  groupFallback?: string;
}): string {
  if (params.isGroup) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const label = params.groupLabel?.trim() || params.groupFallback || "Group";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = params.groupId?.trim();
    return id ? `${label} id:${id}` : label;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const directLabel = params.directLabel.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const directId = params.directId?.trim();
  if (!directId || directId === directLabel) {
    return directLabel;
  }
  return `${directLabel} id:${directId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAgentId(value: string | undefined | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "main";
  }
  if (/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(trimmed)) {
    return trimmed;
  }
  return (
    trimmed
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .slice(0, 64) || "main"
  );
}

type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];

function listAgents(cfg: OpenClawConfig): AgentEntry[] {
  const list = cfg.agents?.list;
  if (!Array.isArray(list)) {
    return [];
  }
  return list.filter((entry): entry is AgentEntry => Boolean(entry && typeof entry === "object"));
}

function resolveAgentEntry(cfg: OpenClawConfig, agentId: string): AgentEntry | undefined {
  const id = normalizeAgentId(agentId);
  return listAgents(cfg).find((entry) => normalizeAgentId(entry.id) === id);
}

export function resolveIdentityName(cfg: OpenClawConfig, agentId: string): string | undefined {
  const entry = resolveAgentEntry(cfg, agentId);
  return entry?.identity?.name?.trim() || undefined;
}

export function resolveThreadSessionKeys(params: {
  baseSessionKey: string;
  threadId?: string | null;
  parentSessionKey?: string;
  useSuffix?: boolean;
}): { sessionKey: string; parentSessionKey?: string } {
  const threadId = (params.threadId ?? "").trim();
  if (!threadId) {
    return { sessionKey: params.baseSessionKey, parentSessionKey: undefined };
  }
  const useSuffix = params.useSuffix ?? true;
  const sessionKey = useSuffix
    ? `${params.baseSessionKey}:thread:${threadId}`
    : params.baseSessionKey;
  return { sessionKey, parentSessionKey: params.parentSessionKey };
}
