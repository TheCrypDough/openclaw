/*
 * AUTO ANNOTATION
 * File: src/memory/batch-runner.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { splitBatchRequests } from "./batch-utils.js";
import { runWithConcurrency } from "./internal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runEmbeddingBatchGroups<TRequest>(params: {
  requests: TRequest[];
  maxRequests: number;
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debugLabel: string;
  debug?: (message: string, data?: Record<string, unknown>) => void;
  runGroup: (args: {
    group: TRequest[];
    groupIndex: number;
    groups: number;
    byCustomId: Map<string, number[]>;
  }) => Promise<void>;
}): Promise<Map<string, number[]>> {
  if (params.requests.length === 0) {
    return new Map();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groups = splitBatchRequests(params.requests, params.maxRequests);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const byCustomId = new Map<string, number[]>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tasks = groups.map((group, groupIndex) => async () => {
    await params.runGroup({ group, groupIndex, groups: groups.length, byCustomId });
  });

  params.debug?.(params.debugLabel, {
    requests: params.requests.length,
    groups: groups.length,
    wait: params.wait,
    concurrency: params.concurrency,
    pollIntervalMs: params.pollIntervalMs,
    timeoutMs: params.timeoutMs,
  });

  await runWithConcurrency(tasks, params.concurrency);
  return byCustomId;
}
