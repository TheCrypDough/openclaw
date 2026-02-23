/*
 * AUTO ANNOTATION
 * File: src/utils/run-with-concurrency.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ConcurrencyErrorMode = "continue" | "stop";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runTasksWithConcurrency<T>(params: {
  tasks: Array<() => Promise<T>>;
  limit: number;
  errorMode?: ConcurrencyErrorMode;
  onTaskError?: (error: unknown, index: number) => void;
}): Promise<{ results: T[]; firstError: unknown; hasError: boolean }> {
  const { tasks, limit, onTaskError } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errorMode = params.errorMode ?? "continue";
  if (tasks.length === 0) {
    return { results: [], firstError: undefined, hasError: false };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedLimit = Math.max(1, Math.min(limit, tasks.length));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const results: T[] = Array.from({ length: tasks.length });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let next = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let firstError: unknown = undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let hasError = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workers = Array.from({ length: resolvedLimit }, async () => {
    while (true) {
      if (errorMode === "stop" && hasError) {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const index = next;
      next += 1;
      if (index >= tasks.length) {
        return;
      }
      try {
        results[index] = await tasks[index]();
      } catch (error) {
        if (!hasError) {
          firstError = error;
          hasError = true;
        }
        onTaskError?.(error, index);
        if (errorMode === "stop") {
          return;
        }
      }
    }
  });

  await Promise.allSettled(workers);
  return { results, firstError, hasError };
}
