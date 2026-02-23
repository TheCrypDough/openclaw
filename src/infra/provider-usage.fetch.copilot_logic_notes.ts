/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.fetch.copilot.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildUsageHttpErrorSnapshot, fetchJson } from "./provider-usage.fetch.shared.js";
import { clampPercent, PROVIDER_LABELS } from "./provider-usage.shared.js";
import type { ProviderUsageSnapshot, UsageWindow } from "./provider-usage.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CopilotUsageResponse = {
  quota_snapshots?: {
    premium_interactions?: { percent_remaining?: number | null };
    chat?: { percent_remaining?: number | null };
  };
  copilot_plan?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchCopilotUsage(
  token: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await fetchJson(
    "https://api.github.com/copilot_internal/user",
    {
      headers: {
        Authorization: `token ${token}`,
        "Editor-Version": "vscode/1.96.2",
        "User-Agent": "GitHubCopilotChat/0.26.7",
        "X-Github-Api-Version": "2025-04-01",
      },
    },
    timeoutMs,
    fetchFn,
  );

  if (!res.ok) {
    return buildUsageHttpErrorSnapshot({
      provider: "github-copilot",
      status: res.status,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data = (await res.json()) as CopilotUsageResponse;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const windows: UsageWindow[] = [];

  if (data.quota_snapshots?.premium_interactions) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const remaining = data.quota_snapshots.premium_interactions.percent_remaining;
    windows.push({
      label: "Premium",
      usedPercent: clampPercent(100 - (remaining ?? 0)),
    });
  }

  if (data.quota_snapshots?.chat) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const remaining = data.quota_snapshots.chat.percent_remaining;
    windows.push({
      label: "Chat",
      usedPercent: clampPercent(100 - (remaining ?? 0)),
    });
  }

  return {
    provider: "github-copilot",
    displayName: PROVIDER_LABELS["github-copilot"],
    windows,
    plan: data.copilot_plan,
  };
}
