/*
 * AUTO ANNOTATION
 * File: src/extensionAPI.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { resolveAgentDir, resolveAgentWorkspaceDir } from "./agents/agent-scope.ts";

export { DEFAULT_MODEL, DEFAULT_PROVIDER } from "./agents/defaults.ts";
export { resolveAgentIdentity } from "./agents/identity.ts";
export { resolveThinkingDefault } from "./agents/model-selection.ts";
export { runEmbeddedPiAgent } from "./agents/pi-embedded.ts";
export { resolveAgentTimeoutMs } from "./agents/timeout.ts";
export { ensureAgentWorkspace } from "./agents/workspace.ts";
export {
  resolveStorePath,
  loadSessionStore,
  saveSessionStore,
  resolveSessionFilePath,
} from "./config/sessions.ts";
