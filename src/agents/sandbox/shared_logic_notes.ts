/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox/shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { normalizeAgentId } from "../../routing/session-key.js";
import { resolveUserPath } from "../../utils.js";
import { resolveAgentIdFromSessionKey } from "../agent-scope.js";
import { hashTextSha256 } from "./hash.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function slugifySessionKey(value: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim() || "session";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hash = hashTextSha256(trimmed).slice(0, 8);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safe = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = safe.slice(0, 32) || "session";
  return `${base}-${hash}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSandboxWorkspaceDir(root: string, sessionKey: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedRoot = resolveUserPath(root);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slug = slugifySessionKey(sessionKey);
  return path.join(resolvedRoot, slug);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSandboxScopeKey(scope: "session" | "agent" | "shared", sessionKey: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = sessionKey.trim() || "main";
  if (scope === "shared") {
    return "shared";
  }
  if (scope === "session") {
    return trimmed;
  }
  const agentId = resolveAgentIdFromSessionKey(trimmed);
  return `agent:${agentId}`;
}

export function resolveSandboxAgentId(scopeKey: string): string | undefined {
  const trimmed = scopeKey.trim();
  if (!trimmed || trimmed === "shared") {
    return undefined;
  }
  const parts = trimmed.split(":").filter(Boolean);
  if (parts[0] === "agent" && parts[1]) {
    return normalizeAgentId(parts[1]);
  }
  return resolveAgentIdFromSessionKey(trimmed);
}
