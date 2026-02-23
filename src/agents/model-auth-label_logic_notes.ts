/*
 * AUTO ANNOTATION
 * File: src/agents/model-auth-label.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions.js";
import {
  ensureAuthProfileStore,
  resolveAuthProfileDisplayLabel,
  resolveAuthProfileOrder,
} from "./auth-profiles.js";
import { getCustomProviderApiKey, resolveEnvApiKey } from "./model-auth.js";
import { normalizeProviderId } from "./model-selection.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatApiKeySnippet(apiKey: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const compact = apiKey.replace(/\s+/g, "");
  if (!compact) {
    return "unknown";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const edge = compact.length >= 12 ? 6 : 4;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const head = compact.slice(0, edge);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tail = compact.slice(-edge);
  return `${head}…${tail}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveModelAuthLabel(params: {
  provider?: string;
  cfg?: OpenClawConfig;
  sessionEntry?: SessionEntry;
  agentDir?: string;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedProvider = params.provider?.trim();
  if (!resolvedProvider) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerKey = normalizeProviderId(resolvedProvider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = ensureAuthProfileStore(params.agentDir, {
    allowKeychainPrompt: false,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
  const order = resolveAuthProfileOrder({
    cfg: params.cfg,
    store,
    provider: providerKey,
    preferredProfile: profileOverride,
  });
  const candidates = [profileOverride, ...order].filter(Boolean) as string[];

  for (const profileId of candidates) {
    const profile = store.profiles[profileId];
    if (!profile || normalizeProviderId(profile.provider) !== providerKey) {
      continue;
    }
    const label = resolveAuthProfileDisplayLabel({
      cfg: params.cfg,
      store,
      profileId,
    });
    if (profile.type === "oauth") {
      return `oauth${label ? ` (${label})` : ""}`;
    }
    if (profile.type === "token") {
      return `token ${formatApiKeySnippet(profile.token)}${label ? ` (${label})` : ""}`;
    }
    return `api-key ${formatApiKeySnippet(profile.key ?? "")}${label ? ` (${label})` : ""}`;
  }

  const envKey = resolveEnvApiKey(providerKey);
  if (envKey?.apiKey) {
    if (envKey.source.includes("OAUTH_TOKEN")) {
      return `oauth (${envKey.source})`;
    }
    return `api-key ${formatApiKeySnippet(envKey.apiKey)} (${envKey.source})`;
  }

  const customKey = getCustomProviderApiKey(params.cfg, providerKey);
  if (customKey) {
    return `api-key ${formatApiKeySnippet(customKey)} (models.json)`;
  }

  return "unknown";
}
