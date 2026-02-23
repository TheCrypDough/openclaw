/*
 * AUTO ANNOTATION
 * File: src/agents/channel-tools.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelDock } from "../channels/dock.js";
import { getChannelPlugin, listChannelPlugins } from "../channels/plugins/index.js";
import type {
  ChannelAgentTool,
  ChannelMessageActionName,
  ChannelPlugin,
} from "../channels/plugins/types.js";
import { normalizeAnyChannelId } from "../channels/registry.js";
import type { OpenClawConfig } from "../config/config.js";
import { defaultRuntime } from "../runtime.js";

/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listChannelSupportedActions(params: {
  cfg?: OpenClawConfig;
  channel?: string;
}): ChannelMessageActionName[] {
  if (!params.channel) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(params.channel as Parameters<typeof getChannelPlugin>[0]);
  if (!plugin?.actions?.listActions) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = params.cfg ?? ({} as OpenClawConfig);
  return runPluginListActions(plugin, cfg);
}

/**
 * Get the list of all supported message actions across all configured channels.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listAllChannelSupportedActions(params: {
  cfg?: OpenClawConfig;
}): ChannelMessageActionName[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actions = new Set<ChannelMessageActionName>();
  for (const plugin of listChannelPlugins()) {
    if (!plugin.actions?.listActions) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = params.cfg ?? ({} as OpenClawConfig);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelActions = runPluginListActions(plugin, cfg);
    for (const action of channelActions) {
      actions.add(action);
    }
  }
  return Array.from(actions);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listChannelAgentTools(params: { cfg?: OpenClawConfig }): ChannelAgentTool[] {
  // Channel docking: aggregate channel-owned tools (login, etc.).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tools: ChannelAgentTool[] = [];
  for (const plugin of listChannelPlugins()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = plugin.agentTools;
    if (!entry) {
      continue;
    }
    const resolved = typeof entry === "function" ? entry(params) : entry;
    if (Array.isArray(resolved)) {
      tools.push(...resolved);
    }
  }
  return tools;
}

export function resolveChannelMessageToolHints(params: {
  cfg?: OpenClawConfig;
  channel?: string | null;
  accountId?: string | null;
}): string[] {
  const channelId = normalizeAnyChannelId(params.channel);
  if (!channelId) {
    return [];
  }
  const dock = getChannelDock(channelId);
  const resolve = dock?.agentPrompt?.messageToolHints;
  if (!resolve) {
    return [];
  }
  const cfg = params.cfg ?? ({} as OpenClawConfig);
  return (resolve({ cfg, accountId: params.accountId }) ?? [])
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const loggedListActionErrors = new Set<string>();

function runPluginListActions(
  plugin: ChannelPlugin,
  cfg: OpenClawConfig,
): ChannelMessageActionName[] {
  if (!plugin.actions?.listActions) {
    return [];
  }
  try {
    const listed = plugin.actions.listActions({ cfg });
    return Array.isArray(listed) ? listed : [];
  } catch (err) {
    logListActionsError(plugin.id, err);
    return [];
  }
}

function logListActionsError(pluginId: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  const key = `${pluginId}:${message}`;
  if (loggedListActionErrors.has(key)) {
    return;
  }
  loggedListActionErrors.add(key);
  const stack = err instanceof Error && err.stack ? err.stack : null;
  const details = stack ?? message;
  defaultRuntime.error?.(`[channel-tools] ${pluginId}.actions.listActions failed: ${details}`);
}

export const __testing = {
  resetLoggedListActionErrors() {
    loggedListActionErrors.clear();
  },
};
