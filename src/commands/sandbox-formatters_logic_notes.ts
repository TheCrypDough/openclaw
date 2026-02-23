/*
 * AUTO ANNOTATION
 * File: src/commands/sandbox-formatters.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Formatting utilities for sandbox CLI output
 */

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatStatus(running: boolean): string {
  return running ? "🟢 running" : "⚫ stopped";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatSimpleStatus(running: boolean): string {
  return running ? "running" : "stopped";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatImageMatch(matches: boolean): string {
  return matches ? "✓" : "⚠️  mismatch";
}

/**
 * Type guard and counter utilities
 */

export type ContainerItem = {
  running: boolean;
  imageMatch: boolean;
  containerName: string;
  sessionKey: string;
  image: string;
  createdAtMs: number;
  lastUsedAtMs: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function countRunning<T extends { running: boolean }>(items: T[]): number {
  return items.filter((item) => item.running).length;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function countMismatches<T extends { imageMatch: boolean }>(items: T[]): number {
  return items.filter((item) => !item.imageMatch).length;
}
