/*
 * AUTO ANNOTATION
 * File: src/agents/subagent-registry-queries.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { DeliveryContext } from "../utils/delivery-context.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function findRunIdsByChildSessionKeyFromRuns(
  runs: Map<string, SubagentRunRecord>,
  childSessionKey: string,
): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = childSessionKey.trim();
  if (!key) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runIds: string[] = [];
  for (const [runId, entry] of runs.entries()) {
    if (entry.childSessionKey === key) {
      runIds.push(runId);
    }
  }
  return runIds;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listRunsForRequesterFromRuns(
  runs: Map<string, SubagentRunRecord>,
  requesterSessionKey: string,
): SubagentRunRecord[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = requesterSessionKey.trim();
  if (!key) {
    return [];
  }
  return [...runs.values()].filter((entry) => entry.requesterSessionKey === key);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveRequesterForChildSessionFromRuns(
  runs: Map<string, SubagentRunRecord>,
  childSessionKey: string,
): {
  requesterSessionKey: string;
  requesterOrigin?: DeliveryContext;
} | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = childSessionKey.trim();
  if (!key) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let best: SubagentRunRecord | undefined;
  for (const entry of runs.values()) {
    if (entry.childSessionKey !== key) {
      continue;
    }
    if (!best || entry.createdAt > best.createdAt) {
      best = entry;
    }
  }
  if (!best) {
    return null;
  }
  return {
    requesterSessionKey: best.requesterSessionKey,
    requesterOrigin: best.requesterOrigin,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function countActiveRunsForSessionFromRuns(
  runs: Map<string, SubagentRunRecord>,
  requesterSessionKey: string,
): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = requesterSessionKey.trim();
  if (!key) {
    return 0;
  }
  let count = 0;
  for (const entry of runs.values()) {
    if (entry.requesterSessionKey !== key) {
      continue;
    }
    if (typeof entry.endedAt === "number") {
      continue;
    }
    count += 1;
  }
  return count;
}

export function countActiveDescendantRunsFromRuns(
  runs: Map<string, SubagentRunRecord>,
  rootSessionKey: string,
): number {
  const root = rootSessionKey.trim();
  if (!root) {
    return 0;
  }
  const pending = [root];
  const visited = new Set<string>([root]);
  let count = 0;
  while (pending.length > 0) {
    const requester = pending.shift();
    if (!requester) {
      continue;
    }
    for (const entry of runs.values()) {
      if (entry.requesterSessionKey !== requester) {
        continue;
      }
      if (typeof entry.endedAt !== "number") {
        count += 1;
      }
      const childKey = entry.childSessionKey.trim();
      if (!childKey || visited.has(childKey)) {
        continue;
      }
      visited.add(childKey);
      pending.push(childKey);
    }
  }
  return count;
}

export function listDescendantRunsForRequesterFromRuns(
  runs: Map<string, SubagentRunRecord>,
  rootSessionKey: string,
): SubagentRunRecord[] {
  const root = rootSessionKey.trim();
  if (!root) {
    return [];
  }
  const pending = [root];
  const visited = new Set<string>([root]);
  const descendants: SubagentRunRecord[] = [];
  while (pending.length > 0) {
    const requester = pending.shift();
    if (!requester) {
      continue;
    }
    for (const entry of runs.values()) {
      if (entry.requesterSessionKey !== requester) {
        continue;
      }
      descendants.push(entry);
      const childKey = entry.childSessionKey.trim();
      if (!childKey || visited.has(childKey)) {
        continue;
      }
      visited.add(childKey);
      pending.push(childKey);
    }
  }
  return descendants;
}
