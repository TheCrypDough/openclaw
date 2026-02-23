/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.load.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveFetch } from "./fetch.js";
import { type ProviderAuth, resolveProviderAuths } from "./provider-usage.auth.js";
import {
  fetchAntigravityUsage,
  fetchClaudeUsage,
  fetchCodexUsage,
  fetchCopilotUsage,
  fetchGeminiUsage,
  fetchMinimaxUsage,
  fetchZaiUsage,
} from "./provider-usage.fetch.js";
import {
  DEFAULT_TIMEOUT_MS,
  ignoredErrors,
  PROVIDER_LABELS,
  usageProviders,
  withTimeout,
} from "./provider-usage.shared.js";
import type {
  ProviderUsageSnapshot,
  UsageProviderId,
  UsageSummary,
} from "./provider-usage.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UsageSummaryOptions = {
  now?: number;
  timeoutMs?: number;
  providers?: UsageProviderId[];
  auth?: ProviderAuth[];
  agentDir?: string;
  fetch?: typeof fetch;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadProviderUsageSummary(
  opts: UsageSummaryOptions = {},
): Promise<UsageSummary> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = opts.now ?? Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchFn = resolveFetch(opts.fetch);
  if (!fetchFn) {
    throw new Error("fetch is not available");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const auths = await resolveProviderAuths({
    providers: opts.providers ?? usageProviders,
    auth: opts.auth,
    agentDir: opts.agentDir,
  });
  if (auths.length === 0) {
    return { updatedAt: now, providers: [] };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tasks = auths.map((auth) =>
    withTimeout(
      (async (): Promise<ProviderUsageSnapshot> => {
        switch (auth.provider) {
          case "anthropic":
            return await fetchClaudeUsage(auth.token, timeoutMs, fetchFn);
          case "github-copilot":
            return await fetchCopilotUsage(auth.token, timeoutMs, fetchFn);
          case "google-antigravity":
            return await fetchAntigravityUsage(auth.token, timeoutMs, fetchFn);
          case "google-gemini-cli":
            return await fetchGeminiUsage(auth.token, timeoutMs, fetchFn, auth.provider);
          case "openai-codex":
            return await fetchCodexUsage(auth.token, auth.accountId, timeoutMs, fetchFn);
          case "minimax":
            return await fetchMinimaxUsage(auth.token, timeoutMs, fetchFn);
          case "xiaomi":
            return {
              provider: "xiaomi",
              displayName: PROVIDER_LABELS.xiaomi,
              windows: [],
            };
          case "zai":
            return await fetchZaiUsage(auth.token, timeoutMs, fetchFn);
          default:
            return {
              provider: auth.provider,
              displayName: PROVIDER_LABELS[auth.provider],
              windows: [],
              error: "Unsupported provider",
            };
        }
      })(),
      timeoutMs + 1000,
      {
        provider: auth.provider,
        displayName: PROVIDER_LABELS[auth.provider],
        windows: [],
        error: "Timeout",
      },
    ),
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshots = await Promise.all(tasks);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providers = snapshots.filter((entry) => {
    if (entry.windows.length > 0) {
      return true;
    }
    if (!entry.error) {
      return true;
    }
    return !ignoredErrors.has(entry.error);
  });

  return { updatedAt: now, providers };
}
