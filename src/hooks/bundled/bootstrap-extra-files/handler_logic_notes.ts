/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled/bootstrap-extra-files/handler.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  filterBootstrapFilesForSession,
  loadExtraBootstrapFiles,
} from "../../../agents/workspace.js";
import { createSubsystemLogger } from "../../../logging/subsystem.js";
import { resolveHookConfig } from "../../config.js";
import { isAgentBootstrapEvent, type HookHandler } from "../../hooks.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const HOOK_KEY = "bootstrap-extra-files";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("bootstrap-extra-files");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveExtraBootstrapPatterns(hookConfig: Record<string, unknown>): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromPaths = normalizeStringArray(hookConfig.paths);
  if (fromPaths.length > 0) {
    return fromPaths;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromPatterns = normalizeStringArray(hookConfig.patterns);
  if (fromPatterns.length > 0) {
    return fromPatterns;
  }
  return normalizeStringArray(hookConfig.files);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const bootstrapExtraFilesHook: HookHandler = async (event) => {
  if (!isAgentBootstrapEvent(event)) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const context = event.context;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hookConfig = resolveHookConfig(context.cfg, HOOK_KEY);
  if (!hookConfig || hookConfig.enabled === false) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const patterns = resolveExtraBootstrapPatterns(hookConfig as Record<string, unknown>);
  if (patterns.length === 0) {
    return;
  }

  try {
    const extras = await loadExtraBootstrapFiles(context.workspaceDir, patterns);
    if (extras.length === 0) {
      return;
    }
    context.bootstrapFiles = filterBootstrapFilesForSession(
      [...context.bootstrapFiles, ...extras],
      context.sessionKey,
    );
  } catch (err) {
    log.warn(`failed: ${String(err)}`);
  }
};

export default bootstrapExtraFilesHook;
