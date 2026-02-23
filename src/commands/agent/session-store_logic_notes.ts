/*
 * AUTO ANNOTATION
 * File: src/commands/agent/session-store.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { setCliSessionId } from "../../agents/cli-session.js";
import { lookupContextTokens } from "../../agents/context.js";
import { DEFAULT_CONTEXT_TOKENS } from "../../agents/defaults.js";
import { isCliProvider } from "../../agents/model-selection.js";
import { deriveSessionTotalTokens, hasNonzeroUsage } from "../../agents/usage.js";
import type { OpenClawConfig } from "../../config/config.js";
import { type SessionEntry, updateSessionStore } from "../../config/sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RunResult = Awaited<
  ReturnType<(typeof import("../../agents/pi-embedded.js"))["runEmbeddedPiAgent"]>
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function updateSessionStoreAfterAgentRun(params: {
  cfg: OpenClawConfig;
  contextTokensOverride?: number;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  sessionStore: Record<string, SessionEntry>;
  defaultProvider: string;
  defaultModel: string;
  fallbackProvider?: string;
  fallbackModel?: string;
  result: RunResult;
}) {
  const {
    cfg,
    sessionId,
    sessionKey,
    storePath,
    sessionStore,
    defaultProvider,
    defaultModel,
    fallbackProvider,
    fallbackModel,
    result,
  } = params;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const usage = result.meta.agentMeta?.usage;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const promptTokens = result.meta.agentMeta?.promptTokens;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const compactionsThisRun = Math.max(0, result.meta.agentMeta?.compactionCount ?? 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelUsed = result.meta.agentMeta?.model ?? fallbackModel ?? defaultModel;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerUsed = result.meta.agentMeta?.provider ?? fallbackProvider ?? defaultProvider;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contextTokens =
    params.contextTokensOverride ?? lookupContextTokens(modelUsed) ?? DEFAULT_CONTEXT_TOKENS;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = sessionStore[sessionKey] ?? {
    sessionId,
    updatedAt: Date.now(),
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next: SessionEntry = {
    ...entry,
    sessionId,
    updatedAt: Date.now(),
    modelProvider: providerUsed,
    model: modelUsed,
    contextTokens,
  };
  if (isCliProvider(providerUsed, cfg)) {
    const cliSessionId = result.meta.agentMeta?.sessionId?.trim();
    if (cliSessionId) {
      setCliSessionId(next, providerUsed, cliSessionId);
    }
  }
  next.abortedLastRun = result.meta.aborted ?? false;
  if (hasNonzeroUsage(usage)) {
    const input = usage.input ?? 0;
    const output = usage.output ?? 0;
    const totalTokens =
      deriveSessionTotalTokens({
        usage,
        contextTokens,
        promptTokens,
      }) ?? input;
    next.inputTokens = input;
    next.outputTokens = output;
    next.totalTokens = totalTokens;
    next.totalTokensFresh = true;
    next.cacheRead = usage.cacheRead ?? 0;
    next.cacheWrite = usage.cacheWrite ?? 0;
  }
  if (compactionsThisRun > 0) {
    next.compactionCount = (entry.compactionCount ?? 0) + compactionsThisRun;
  }
  sessionStore[sessionKey] = next;
  await updateSessionStore(storePath, (store) => {
    store[sessionKey] = next;
  });
}
