/*
 * AUTO ANNOTATION
 * File: src/agents/cli-backends.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { CliBackendConfig } from "../config/types.js";
import {
  CLI_FRESH_WATCHDOG_DEFAULTS,
  CLI_RESUME_WATCHDOG_DEFAULTS,
} from "./cli-watchdog-defaults.js";
import { normalizeProviderId } from "./model-selection.js";

export type ResolvedCliBackend = {
  id: string;
  config: CliBackendConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CLAUDE_MODEL_ALIASES: Record<string, string> = {
  opus: "opus",
  "opus-4.6": "opus",
  "opus-4.5": "opus",
  "opus-4": "opus",
  "claude-opus-4-6": "opus",
  "claude-opus-4-5": "opus",
  "claude-opus-4": "opus",
  sonnet: "sonnet",
  "sonnet-4.6": "sonnet",
  "sonnet-4.5": "sonnet",
  "sonnet-4.1": "sonnet",
  "sonnet-4.0": "sonnet",
  "claude-sonnet-4-6": "sonnet",
  "claude-sonnet-4-5": "sonnet",
  "claude-sonnet-4-1": "sonnet",
  "claude-sonnet-4-0": "sonnet",
  haiku: "haiku",
  "haiku-3.5": "haiku",
  "claude-haiku-3-5": "haiku",
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CLAUDE_BACKEND: CliBackendConfig = {
  command: "claude",
  args: ["-p", "--output-format", "json", "--dangerously-skip-permissions"],
  resumeArgs: [
    "-p",
    "--output-format",
    "json",
    "--dangerously-skip-permissions",
    "--resume",
    "{sessionId}",
  ],
  output: "json",
  input: "arg",
  modelArg: "--model",
  modelAliases: CLAUDE_MODEL_ALIASES,
  sessionArg: "--session-id",
  sessionMode: "always",
  sessionIdFields: ["session_id", "sessionId", "conversation_id", "conversationId"],
  systemPromptArg: "--append-system-prompt",
  systemPromptMode: "append",
  systemPromptWhen: "first",
  clearEnv: ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD"],
  reliability: {
    watchdog: {
      fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
      resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS },
    },
  },
  serialize: true,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CODEX_BACKEND: CliBackendConfig = {
  command: "codex",
  args: ["exec", "--json", "--color", "never", "--sandbox", "read-only", "--skip-git-repo-check"],
  resumeArgs: [
    "exec",
    "resume",
    "{sessionId}",
    "--color",
    "never",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
  ],
  output: "jsonl",
  resumeOutput: "text",
  input: "arg",
  modelArg: "--model",
  sessionIdFields: ["thread_id"],
  sessionMode: "existing",
  imageArg: "--image",
  imageMode: "repeat",
  reliability: {
    watchdog: {
      fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
      resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS },
    },
  },
  serialize: true,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeBackendKey(key: string): string {
  return normalizeProviderId(key);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function pickBackendConfig(
  config: Record<string, CliBackendConfig>,
  normalizedId: string,
): CliBackendConfig | undefined {
  for (const [key, entry] of Object.entries(config)) {
    if (normalizeBackendKey(key) === normalizedId) {
      return entry;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mergeBackendConfig(base: CliBackendConfig, override?: CliBackendConfig): CliBackendConfig {
  if (!override) {
    return { ...base };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseFresh = base.reliability?.watchdog?.fresh ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseResume = base.reliability?.watchdog?.resume ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const overrideFresh = override.reliability?.watchdog?.fresh ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const overrideResume = override.reliability?.watchdog?.resume ?? {};
  return {
    ...base,
    ...override,
    args: override.args ?? base.args,
    env: { ...base.env, ...override.env },
    modelAliases: { ...base.modelAliases, ...override.modelAliases },
    clearEnv: Array.from(new Set([...(base.clearEnv ?? []), ...(override.clearEnv ?? [])])),
    sessionIdFields: override.sessionIdFields ?? base.sessionIdFields,
    sessionArgs: override.sessionArgs ?? base.sessionArgs,
    resumeArgs: override.resumeArgs ?? base.resumeArgs,
    reliability: {
      ...base.reliability,
      ...override.reliability,
      watchdog: {
        ...base.reliability?.watchdog,
        ...override.reliability?.watchdog,
        fresh: {
          ...baseFresh,
          ...overrideFresh,
        },
        resume: {
          ...baseResume,
          ...overrideResume,
        },
      },
    },
  };
}

export function resolveCliBackendIds(cfg?: OpenClawConfig): Set<string> {
  const ids = new Set<string>([
    normalizeBackendKey("claude-cli"),
    normalizeBackendKey("codex-cli"),
  ]);
  const configured = cfg?.agents?.defaults?.cliBackends ?? {};
  for (const key of Object.keys(configured)) {
    ids.add(normalizeBackendKey(key));
  }
  return ids;
}

export function resolveCliBackendConfig(
  provider: string,
  cfg?: OpenClawConfig,
): ResolvedCliBackend | null {
  const normalized = normalizeBackendKey(provider);
  const configured = cfg?.agents?.defaults?.cliBackends ?? {};
  const override = pickBackendConfig(configured, normalized);

  if (normalized === "claude-cli") {
    const merged = mergeBackendConfig(DEFAULT_CLAUDE_BACKEND, override);
    const command = merged.command?.trim();
    if (!command) {
      return null;
    }
    return { id: normalized, config: { ...merged, command } };
  }
  if (normalized === "codex-cli") {
    const merged = mergeBackendConfig(DEFAULT_CODEX_BACKEND, override);
    const command = merged.command?.trim();
    if (!command) {
      return null;
    }
    return { id: normalized, config: { ...merged, command } };
  }

  if (!override) {
    return null;
  }
  const command = override.command?.trim();
  if (!command) {
    return null;
  }
  return { id: normalized, config: { ...override, command } };
}
