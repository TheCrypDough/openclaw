/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.zai.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildUsageHttpErrorSnapshot, fetchJson } from "./provider-usage.fetch.shared.js";
import { clampPercent, PROVIDER_LABELS } from "./provider-usage.shared.js";
import type { ProviderUsageSnapshot, UsageWindow } from "./provider-usage.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ZaiUsageResponse = {
  success?: boolean;
  code?: number;
  msg?: string;
  data?: {
    planName?: string;
    plan?: string;
    limits?: Array<{
      type?: string;
      percentage?: number;
      unit?: number;
      number?: number;
      nextResetTime?: string;
    }>;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchZaiUsage(
  apiKey: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await fetchJson(
    "https://api.z.ai/api/monitor/usage/quota/limit",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
    timeoutMs,
    fetchFn,
  );

  if (!res.ok) {
    return buildUsageHttpErrorSnapshot({
      provider: "zai",
      status: res.status,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data = (await res.json()) as ZaiUsageResponse;
  if (!data.success || data.code !== 200) {
    return {
      provider: "zai",
      displayName: PROVIDER_LABELS.zai,
      windows: [],
      error: data.msg || "API error",
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const windows: UsageWindow[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const limits = data.data?.limits || [];

  for (const limit of limits) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const percent = clampPercent(limit.percentage || 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextReset = limit.nextResetTime ? new Date(limit.nextResetTime).getTime() : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let windowLabel = "Limit";
    if (limit.unit === 1) {
      windowLabel = `${limit.number}d`;
    } else if (limit.unit === 3) {
      windowLabel = `${limit.number}h`;
    } else if (limit.unit === 5) {
      windowLabel = `${limit.number}m`;
    }

    if (limit.type === "TOKENS_LIMIT") {
      windows.push({
        label: `Tokens (${windowLabel})`,
        usedPercent: percent,
        resetAt: nextReset,
      });
    } else if (limit.type === "TIME_LIMIT") {
      windows.push({
        label: "Monthly",
        usedPercent: percent,
        resetAt: nextReset,
      });
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const planName = data.data?.planName || data.data?.plan || undefined;
  return {
    provider: "zai",
    displayName: PROVIDER_LABELS.zai,
    windows,
    plan: planName,
  };
}
