/*
 * AUTO ANNOTATION
 * File: src/agents/bash-process-registry.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { ProcessSession } from "./bash-process-registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createProcessSessionFixture(params: {
  id: string;
  command?: string;
  startedAt?: number;
  cwd?: string;
  maxOutputChars?: number;
  pendingMaxOutputChars?: number;
  backgrounded?: boolean;
  pid?: number;
  child?: ChildProcessWithoutNullStreams;
}): ProcessSession {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const session: ProcessSession = {
    id: params.id,
    command: params.command ?? "test",
    startedAt: params.startedAt ?? Date.now(),
    cwd: params.cwd ?? "/tmp",
    maxOutputChars: params.maxOutputChars ?? 10_000,
    pendingMaxOutputChars: params.pendingMaxOutputChars ?? 30_000,
    totalOutputChars: 0,
    pendingStdout: [],
    pendingStderr: [],
    pendingStdoutChars: 0,
    pendingStderrChars: 0,
    aggregated: "",
    tail: "",
    exited: false,
    exitCode: undefined,
    exitSignal: undefined,
    truncated: false,
    backgrounded: params.backgrounded ?? false,
  };
  if (params.pid !== undefined) {
    session.pid = params.pid;
  }
  if (params.child) {
    session.child = params.child;
  }
  return session;
}
