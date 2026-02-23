/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type {
  BashSandboxConfig,
  ExecElevatedDefaults,
  ExecToolDefaults,
  ExecToolDetails,
} from "./bash-tools.exec.js";
export { createExecTool, execTool } from "./bash-tools.exec.js";
export type { ProcessToolDefaults } from "./bash-tools.process.js";
export { createProcessTool, processTool } from "./bash-tools.process.js";
