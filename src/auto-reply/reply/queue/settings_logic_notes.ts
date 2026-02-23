/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/queue/settings.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin } from "../../../channels/plugins/index.js";
import type { InboundDebounceByProvider } from "../../../config/types.messages.js";
import { normalizeQueueDropPolicy, normalizeQueueMode } from "./normalize.js";
import { DEFAULT_QUEUE_CAP, DEFAULT_QUEUE_DEBOUNCE_MS, DEFAULT_QUEUE_DROP } from "./state.js";
import type { QueueMode, QueueSettings, ResolveQueueSettingsParams } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function defaultQueueModeForChannel(_channel?: string): QueueMode {
  return "collect";
}

/** Resolve per-channel debounce override from debounceMsByChannel map. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveChannelDebounce(
  byChannel: InboundDebounceByProvider | undefined,
  channelKey: string | undefined,
): number | undefined {
  if (!channelKey || !byChannel) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = byChannel[channelKey];
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePluginDebounce(channelKey: string | undefined): number | undefined {
  if (!channelKey) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plugin = getChannelPlugin(channelKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = plugin?.defaults?.queue?.debounceMs;
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveQueueSettings(params: ResolveQueueSettingsParams): QueueSettings {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelKey = params.channel?.trim().toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queueCfg = params.cfg.messages?.queue;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerModeRaw =
    channelKey && queueCfg?.byChannel
      ? (queueCfg.byChannel as Record<string, string | undefined>)[channelKey]
      : undefined;
  const resolvedMode =
    params.inlineMode ??
    normalizeQueueMode(params.sessionEntry?.queueMode) ??
    normalizeQueueMode(providerModeRaw) ??
    normalizeQueueMode(queueCfg?.mode) ??
    defaultQueueModeForChannel(channelKey);
  const debounceRaw =
    params.inlineOptions?.debounceMs ??
    params.sessionEntry?.queueDebounceMs ??
    resolveChannelDebounce(queueCfg?.debounceMsByChannel, channelKey) ??
    resolvePluginDebounce(channelKey) ??
    queueCfg?.debounceMs ??
    DEFAULT_QUEUE_DEBOUNCE_MS;
  const capRaw =
    params.inlineOptions?.cap ??
    params.sessionEntry?.queueCap ??
    queueCfg?.cap ??
    DEFAULT_QUEUE_CAP;
  const dropRaw =
    params.inlineOptions?.dropPolicy ??
    params.sessionEntry?.queueDrop ??
    normalizeQueueDropPolicy(queueCfg?.drop) ??
    DEFAULT_QUEUE_DROP;
  return {
    mode: resolvedMode,
    debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : undefined,
    cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : undefined,
    dropPolicy: dropRaw,
  };
}
