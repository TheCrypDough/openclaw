/*
 * AUTO ANNOTATION
 * File: src/infra/provider-usage.shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeProviderId } from "../agents/model-selection.js";
import type { UsageProviderId } from "./provider-usage.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_TIMEOUT_MS = 5000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PROVIDER_LABELS: Record<UsageProviderId, string> = {
  anthropic: "Claude",
  "github-copilot": "Copilot",
  "google-gemini-cli": "Gemini",
  "google-antigravity": "Antigravity",
  minimax: "MiniMax",
  "openai-codex": "Codex",
  xiaomi: "Xiaomi",
  zai: "z.ai",
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const usageProviders: UsageProviderId[] = [
  "anthropic",
  "github-copilot",
  "google-gemini-cli",
  "google-antigravity",
  "minimax",
  "openai-codex",
  "xiaomi",
  "zai",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveUsageProviderId(provider?: string | null): UsageProviderId | undefined {
  if (!provider) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(provider);
  return usageProviders.includes(normalized as UsageProviderId)
    ? (normalized as UsageProviderId)
    : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ignoredErrors = new Set([
  "No credentials",
  "No token",
  "No API key",
  "Not logged in",
  "No auth",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const withTimeout = async <T>(work: Promise<T>, ms: number, fallback: T): Promise<T> => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};
