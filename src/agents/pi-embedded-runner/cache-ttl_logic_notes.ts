/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/cache-ttl.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CustomEntryLike = { type?: unknown; customType?: unknown; data?: unknown };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";

export type CacheTtlEntryData = {
  timestamp: number;
  provider?: string;
  modelId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isCacheTtlEligibleProvider(provider: string, modelId: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedProvider = provider.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedModelId = modelId.toLowerCase();
  if (normalizedProvider === "anthropic") {
    return true;
  }
  if (normalizedProvider === "openrouter" && normalizedModelId.startsWith("anthropic/")) {
    return true;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readLastCacheTtlTimestamp(sessionManager: unknown): number | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sm = sessionManager as { getEntries?: () => CustomEntryLike[] };
  if (!sm?.getEntries) {
    return null;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = sm.getEntries();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let last: number | null = null;
    for (let i = entries.length - 1; i >= 0; i--) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const entry = entries[i];
      if (entry?.type !== "custom" || entry?.customType !== CACHE_TTL_CUSTOM_TYPE) {
        continue;
      }
      const data = entry?.data as Partial<CacheTtlEntryData> | undefined;
      const ts = typeof data?.timestamp === "number" ? data.timestamp : null;
      if (ts && Number.isFinite(ts)) {
        last = ts;
        break;
      }
    }
    return last;
  } catch {
    return null;
  }
}

export function appendCacheTtlTimestamp(sessionManager: unknown, data: CacheTtlEntryData): void {
  const sm = sessionManager as {
    appendCustomEntry?: (customType: string, data: unknown) => void;
  };
  if (!sm?.appendCustomEntry) {
    return;
  }
  try {
    sm.appendCustomEntry(CACHE_TTL_CUSTOM_TYPE, data);
  } catch {
    // ignore persistence failures
  }
}
