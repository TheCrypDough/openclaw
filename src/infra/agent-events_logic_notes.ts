/*
 * AUTO ANNOTATION
 * File: src/infra/agent-events.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { VerboseLevel } from "../auto-reply/thinking.js";

export type AgentEventStream = "lifecycle" | "tool" | "assistant" | "error" | (string & {});

export type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<string, unknown>;
  sessionKey?: string;
};

export type AgentRunContext = {
  sessionKey?: string;
  verboseLevel?: VerboseLevel;
  isHeartbeat?: boolean;
};

// Keep per-run counters so streams stay strictly monotonic per runId.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const seqByRun = new Map<string, number>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const listeners = new Set<(evt: AgentEventPayload) => void>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runContextById = new Map<string, AgentRunContext>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerAgentRunContext(runId: string, context: AgentRunContext) {
  if (!runId) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = runContextById.get(runId);
  if (!existing) {
    runContextById.set(runId, { ...context });
    return;
  }
  if (context.sessionKey && existing.sessionKey !== context.sessionKey) {
    existing.sessionKey = context.sessionKey;
  }
  if (context.verboseLevel && existing.verboseLevel !== context.verboseLevel) {
    existing.verboseLevel = context.verboseLevel;
  }
  if (context.isHeartbeat !== undefined && existing.isHeartbeat !== context.isHeartbeat) {
    existing.isHeartbeat = context.isHeartbeat;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getAgentRunContext(runId: string) {
  return runContextById.get(runId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearAgentRunContext(runId: string) {
  runContextById.delete(runId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetAgentRunContextForTest() {
  runContextById.clear();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function emitAgentEvent(event: Omit<AgentEventPayload, "seq" | "ts">) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nextSeq = (seqByRun.get(event.runId) ?? 0) + 1;
  seqByRun.set(event.runId, nextSeq);
  const context = runContextById.get(event.runId);
  const sessionKey =
    typeof event.sessionKey === "string" && event.sessionKey.trim()
      ? event.sessionKey
      : context?.sessionKey;
  const enriched: AgentEventPayload = {
    ...event,
    sessionKey,
    seq: nextSeq,
    ts: Date.now(),
  };
  for (const listener of listeners) {
    try {
      listener(enriched);
    } catch {
      /* ignore */
    }
  }
}

export function onAgentEvent(listener: (evt: AgentEventPayload) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
