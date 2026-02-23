/*
 * AUTO ANNOTATION
 * File: src/plugins/http-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { normalizePluginHttpPath } from "./http-path.js";
import type { PluginHttpRouteRegistration, PluginRegistry } from "./registry.js";
import { requireActivePluginRegistry } from "./runtime.js";

export type PluginHttpRouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteHandler;
  pluginId?: string;
  source?: string;
  accountId?: string;
  log?: (message: string) => void;
  registry?: PluginRegistry;
}): () => void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = params.registry ?? requireActivePluginRegistry();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const routes = registry.httpRoutes ?? [];
  registry.httpRoutes = routes;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedPath = normalizePluginHttpPath(params.path, params.fallbackPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
  if (!normalizedPath) {
    params.log?.(`plugin: webhook path missing${suffix}`);
    return () => {};
  }

  if (routes.some((entry) => entry.path === normalizedPath)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pluginHint = params.pluginId ? ` (${params.pluginId})` : "";
    params.log?.(`plugin: webhook path ${normalizedPath} already registered${suffix}${pluginHint}`);
    return () => {};
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry: PluginHttpRouteRegistration = {
    path: normalizedPath,
    handler: params.handler,
    pluginId: params.pluginId,
    source: params.source,
  };
  routes.push(entry);

  return () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const index = routes.indexOf(entry);
    if (index >= 0) {
      routes.splice(index, 1);
    }
  };
}
