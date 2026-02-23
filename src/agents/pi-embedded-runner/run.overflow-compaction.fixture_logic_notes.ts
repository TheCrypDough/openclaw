/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { EmbeddedRunAttemptResult } from "./run/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeAttemptResult(
  overrides: Partial<EmbeddedRunAttemptResult> = {},
): EmbeddedRunAttemptResult {
  return {
    aborted: false,
    timedOut: false,
    timedOutDuringCompaction: false,
    promptError: null,
    sessionIdUsed: "test-session",
    assistantTexts: ["Hello!"],
    toolMetas: [],
    lastAssistant: undefined,
    messagesSnapshot: [],
    didSendViaMessagingTool: false,
    messagingToolSentTexts: [],
    messagingToolSentMediaUrls: [],
    messagingToolSentTargets: [],
    cloudCodeAssistFormatError: false,
    ...overrides,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MockRunEmbeddedAttempt = {
  mockResolvedValueOnce: (value: EmbeddedRunAttemptResult) => unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MockCompactDirect = {
  mockResolvedValueOnce: (value: {
    ok: true;
    compacted: true;
    result: {
      summary: string;
      firstKeptEntryId: string;
      tokensBefore: number;
    };
  }) => unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mockOverflowRetrySuccess(params: {
  runEmbeddedAttempt: MockRunEmbeddedAttempt;
  compactDirect: MockCompactDirect;
  overflowMessage?: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const overflowError = new Error(
    params.overflowMessage ?? "request_too_large: Request size exceeds model context window",
  );

  params.runEmbeddedAttempt.mockResolvedValueOnce(
    makeAttemptResult({ promptError: overflowError }),
  );
  params.runEmbeddedAttempt.mockResolvedValueOnce(makeAttemptResult({ promptError: null }));

  params.compactDirect.mockResolvedValueOnce({
    ok: true,
    compacted: true,
    result: {
      summary: "Compacted session",
      firstKeptEntryId: "entry-5",
      tokensBefore: 150000,
    },
  });

  return overflowError;
}
