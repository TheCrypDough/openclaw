/*
 * AUTO ANNOTATION
 * File: src/hooks/plugin-hooks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { OpenClawPluginApi } from "../plugins/types.js";
import { shouldIncludeHook } from "./config.js";
import type { InternalHookHandler } from "./internal-hooks.js";
import type { HookEntry } from "./types.js";
import { loadHookEntriesFromDir } from "./workspace.js";

export type PluginHookLoadResult = {
  hooks: HookEntry[];
  loaded: number;
  skipped: number;
  errors: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveHookDir(api: OpenClawPluginApi, dir: string): string {
  if (path.isAbsolute(dir)) {
    return dir;
  }
  return path.resolve(path.dirname(api.source), dir);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizePluginHookEntry(api: OpenClawPluginApi, entry: HookEntry): HookEntry {
  return {
    ...entry,
    hook: {
      ...entry.hook,
      source: "openclaw-plugin",
      pluginId: api.id,
    },
    metadata: {
      ...entry.metadata,
      hookKey: entry.metadata?.hookKey ?? `${api.id}:${entry.hook.name}`,
      events: entry.metadata?.events ?? [],
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function loadHookHandler(
  entry: HookEntry,
  api: OpenClawPluginApi,
): Promise<InternalHookHandler | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const url = pathToFileURL(entry.hook.handlerPath).href;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cacheBustedUrl = `${url}?t=${Date.now()}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mod = (await import(cacheBustedUrl)) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exportName = entry.metadata?.export ?? "default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = mod[exportName];
    if (typeof handler === "function") {
      return handler as InternalHookHandler;
    }
    api.logger.warn?.(`[hooks] ${entry.hook.name} handler is not a function`);
    return null;
  } catch (err) {
    api.logger.warn?.(`[hooks] Failed to load ${entry.hook.name}: ${String(err)}`);
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function registerPluginHooksFromDir(
  api: OpenClawPluginApi,
  dir: string,
): Promise<PluginHookLoadResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedDir = resolveHookDir(api, dir);
  const hooks = loadHookEntriesFromDir({
    dir: resolvedDir,
    source: "openclaw-plugin",
    pluginId: api.id,
  });

  const result: PluginHookLoadResult = {
    hooks,
    loaded: 0,
    skipped: 0,
    errors: [],
  };

  for (const entry of hooks) {
    const normalizedEntry = normalizePluginHookEntry(api, entry);
    const events = normalizedEntry.metadata?.events ?? [];
    if (events.length === 0) {
      api.logger.warn?.(`[hooks] ${entry.hook.name} has no events; skipping`);
      api.registerHook(events, async () => undefined, {
        entry: normalizedEntry,
        register: false,
      });
      result.skipped += 1;
      continue;
    }

    const handler = await loadHookHandler(entry, api);
    if (!handler) {
      result.errors.push(`[hooks] Failed to load ${entry.hook.name}`);
      api.registerHook(events, async () => undefined, {
        entry: normalizedEntry,
        register: false,
      });
      result.skipped += 1;
      continue;
    }

    const eligible = shouldIncludeHook({ entry: normalizedEntry, config: api.config });
    api.registerHook(events, handler, {
      entry: normalizedEntry,
      register: eligible,
    });

    if (eligible) {
      result.loaded += 1;
    } else {
      result.skipped += 1;
    }
  }

  return result;
}
