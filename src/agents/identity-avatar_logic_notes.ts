/*
 * AUTO ANNOTATION
 * File: src/agents/identity-avatar.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import type { OpenClawConfig } from "../config/config.js";
import { resolveUserPath } from "../utils.js";
import { resolveAgentWorkspaceDir } from "./agent-scope.js";
import { loadAgentIdentityFromWorkspace } from "./identity-file.js";
import { resolveAgentIdentity } from "./identity.js";

export type AgentAvatarResolution =
  | { kind: "none"; reason: string }
  | { kind: "local"; filePath: string }
  | { kind: "remote"; url: string }
  | { kind: "data"; url: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ALLOWED_AVATAR_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeAvatarValue(value: string | undefined | null): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAvatarSource(cfg: OpenClawConfig, agentId: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromConfig = normalizeAvatarValue(resolveAgentIdentity(cfg, agentId)?.avatar);
  if (fromConfig) {
    return fromConfig;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspace = resolveAgentWorkspaceDir(cfg, agentId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromIdentity = normalizeAvatarValue(loadAgentIdentityFromWorkspace(workspace)?.avatar);
  return fromIdentity;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isRemoteAvatar(value: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = value.toLowerCase();
  return lower.startsWith("http://") || lower.startsWith("https://");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isDataAvatar(value: string): boolean {
  return value.toLowerCase().startsWith("data:");
}

function resolveExistingPath(value: string): string {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}

function isPathWithin(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  if (!relative) {
    return true;
  }
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

function resolveLocalAvatarPath(params: {
  raw: string;
  workspaceDir: string;
}): { ok: true; filePath: string } | { ok: false; reason: string } {
  const workspaceRoot = resolveExistingPath(params.workspaceDir);
  const raw = params.raw;
  const resolved =
    raw.startsWith("~") || path.isAbsolute(raw)
      ? resolveUserPath(raw)
      : path.resolve(workspaceRoot, raw);
  const realPath = resolveExistingPath(resolved);
  if (!isPathWithin(workspaceRoot, realPath)) {
    return { ok: false, reason: "outside_workspace" };
  }
  const ext = path.extname(realPath).toLowerCase();
  if (!ALLOWED_AVATAR_EXTS.has(ext)) {
    return { ok: false, reason: "unsupported_extension" };
  }
  try {
    if (!fs.statSync(realPath).isFile()) {
      return { ok: false, reason: "missing" };
    }
  } catch {
    return { ok: false, reason: "missing" };
  }
  return { ok: true, filePath: realPath };
}

export function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string): AgentAvatarResolution {
  const source = resolveAvatarSource(cfg, agentId);
  if (!source) {
    return { kind: "none", reason: "missing" };
  }
  if (isRemoteAvatar(source)) {
    return { kind: "remote", url: source };
  }
  if (isDataAvatar(source)) {
    return { kind: "data", url: source };
  }
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  const resolved = resolveLocalAvatarPath({ raw: source, workspaceDir });
  if (!resolved.ok) {
    return { kind: "none", reason: resolved.reason };
  }
  return { kind: "local", filePath: resolved.filePath };
}
