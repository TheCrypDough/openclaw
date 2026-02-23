/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.gemini.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildUsageHttpErrorSnapshot, fetchJson } from "./provider-usage.fetch.shared.js";
import { clampPercent, PROVIDER_LABELS } from "./provider-usage.shared.js";
import type {
  ProviderUsageSnapshot,
  UsageProviderId,
  UsageWindow,
} from "./provider-usage.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type GeminiUsageResponse = {
  buckets?: Array<{ modelId?: string; remainingFraction?: number }>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchGeminiUsage(
  token: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
  provider: UsageProviderId,
): Promise<ProviderUsageSnapshot> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await fetchJson(
    "https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    },
    timeoutMs,
    fetchFn,
  );

  if (!res.ok) {
    return buildUsageHttpErrorSnapshot({
      provider,
      status: res.status,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data = (await res.json()) as GeminiUsageResponse;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const quotas: Record<string, number> = {};

  for (const bucket of data.buckets || []) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = bucket.modelId || "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const frac = bucket.remainingFraction ?? 1;
    if (!quotas[model] || frac < quotas[model]) {
      quotas[model] = frac;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const windows: UsageWindow[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let proMin = 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let flashMin = 1;
  let hasPro = false;
  let hasFlash = false;

  for (const [model, frac] of Object.entries(quotas)) {
    const lower = model.toLowerCase();
    if (lower.includes("pro")) {
      hasPro = true;
      if (frac < proMin) {
        proMin = frac;
      }
    }
    if (lower.includes("flash")) {
      hasFlash = true;
      if (frac < flashMin) {
        flashMin = frac;
      }
    }
  }

  if (hasPro) {
    windows.push({
      label: "Pro",
      usedPercent: clampPercent((1 - proMin) * 100),
    });
  }
  if (hasFlash) {
    windows.push({
      label: "Flash",
      usedPercent: clampPercent((1 - flashMin) * 100),
    });
  }

  return { provider, displayName: PROVIDER_LABELS[provider], windows };
}
