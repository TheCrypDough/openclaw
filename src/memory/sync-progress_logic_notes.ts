/*
 * AUTO ANNOTATION
 * File: src/memory/sync-progress.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type SyncProgressState = {
  completed: number;
  total: number;
  label?: string;
  report: (update: { completed: number; total: number; label?: string }) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bumpSyncProgressTotal(
  progress: SyncProgressState | undefined,
  delta: number,
  label?: string,
) {
  if (!progress) {
    return;
  }
  progress.total += delta;
  progress.report({
    completed: progress.completed,
    total: progress.total,
    label,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bumpSyncProgressCompleted(
  progress: SyncProgressState | undefined,
  delta = 1,
  label?: string,
) {
  if (!progress) {
    return;
  }
  progress.completed += delta;
  progress.report({
    completed: progress.completed,
    total: progress.total,
    label,
  });
}
