/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/wait-for-idle-before-flush.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type IdleAwareAgent = {
  waitForIdle?: (() => Promise<void>) | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ToolResultFlushManager = {
  flushPendingToolResults?: (() => void) | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS = 30_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitForAgentIdleBestEffort(
  agent: IdleAwareAgent | null | undefined,
  timeoutMs: number,
): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const waitForIdle = agent?.waitForIdle;
  if (typeof waitForIdle !== "function") {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      waitForIdle.call(agent),
      new Promise<void>((resolve) => {
        timeoutHandle = setTimeout(resolve, timeoutMs);
        timeoutHandle.unref?.();
      }),
    ]);
  } catch {
    // Best-effort during cleanup.
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function flushPendingToolResultsAfterIdle(opts: {
  agent: IdleAwareAgent | null | undefined;
  sessionManager: ToolResultFlushManager | null | undefined;
  timeoutMs?: number;
}): Promise<void> {
  await waitForAgentIdleBestEffort(opts.agent, opts.timeoutMs ?? DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS);
  opts.sessionManager?.flushPendingToolResults?.();
}
