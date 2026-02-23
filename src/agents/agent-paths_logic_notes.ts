/*
 * AUTO ANNOTATION
 * File: src/agents/agent-paths.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { DEFAULT_AGENT_ID } from "../routing/session-key.js";
import { resolveUserPath } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveOpenClawAgentDir(): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override =
    process.env.OPENCLAW_AGENT_DIR?.trim() || process.env.PI_CODING_AGENT_DIR?.trim();
  if (override) {
    return resolveUserPath(override);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultAgentDir = path.join(resolveStateDir(), "agents", DEFAULT_AGENT_ID, "agent");
  return resolveUserPath(defaultAgentDir);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensureOpenClawAgentEnv(): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = resolveOpenClawAgentDir();
  if (!process.env.OPENCLAW_AGENT_DIR) {
    process.env.OPENCLAW_AGENT_DIR = dir;
  }
  if (!process.env.PI_CODING_AGENT_DIR) {
    process.env.PI_CODING_AGENT_DIR = dir;
  }
  return dir;
}
