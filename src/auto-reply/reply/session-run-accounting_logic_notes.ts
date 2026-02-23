/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/session-run-accounting.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { deriveSessionTotalTokens, type NormalizedUsage } from "../../agents/usage.js";
import { incrementCompactionCount } from "./session-updates.js";
import { persistSessionUsageUpdate } from "./session-usage.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PersistRunSessionUsageParams = Parameters<typeof persistSessionUsageUpdate>[0];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type IncrementRunCompactionCountParams = Omit<
  Parameters<typeof incrementCompactionCount>[0],
  "tokensAfter"
> & {
  lastCallUsage?: NormalizedUsage;
  contextTokensUsed?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function persistRunSessionUsage(params: PersistRunSessionUsageParams): Promise<void> {
  await persistSessionUsageUpdate(params);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function incrementRunCompactionCount(
  params: IncrementRunCompactionCountParams,
): Promise<number | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tokensAfterCompaction = params.lastCallUsage
    ? deriveSessionTotalTokens({
        usage: params.lastCallUsage,
        contextTokens: params.contextTokensUsed,
      })
    : undefined;
  return incrementCompactionCount({
    sessionEntry: params.sessionEntry,
    sessionStore: params.sessionStore,
    sessionKey: params.sessionKey,
    storePath: params.storePath,
    tokensAfter: tokensAfterCompaction,
  });
}
