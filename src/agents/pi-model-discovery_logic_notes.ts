/*
 * AUTO ANNOTATION
 * File: src/agents/pi-model-discovery.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";

export { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createAuthStorage(AuthStorageLike: unknown, path: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withFactory = AuthStorageLike as { create?: (path: string) => unknown };
  if (typeof withFactory.create === "function") {
    return withFactory.create(path) as AuthStorage;
  }
  return new (AuthStorageLike as { new (path: string): unknown })(path) as AuthStorage;
}

// Compatibility helpers for pi-coding-agent 0.50+ (discover* helpers removed).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function discoverAuthStorage(agentDir: string): AuthStorage {
  return createAuthStorage(AuthStorage, path.join(agentDir, "auth.json"));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function discoverModels(authStorage: AuthStorage, agentDir: string): ModelRegistry {
  return new ModelRegistry(authStorage, path.join(agentDir, "models.json"));
}
