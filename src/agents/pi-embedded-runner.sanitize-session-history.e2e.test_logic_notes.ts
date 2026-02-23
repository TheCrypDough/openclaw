/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner.sanitize-session-history.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as helpers from "./pi-embedded-helpers.js";
import {
  expectGoogleModelApiFullSanitizeCall,
  loadSanitizeSessionHistoryWithCleanMocks,
  makeMockSessionManager,
  makeSimpleUserMessages,
  makeSnapshotChangedOpenAIReasoningScenario,
  sanitizeWithOpenAIResponses,
} from "./pi-embedded-runner.sanitize-session-history.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SanitizeSessionHistory = Awaited<ReturnType<typeof loadSanitizeSessionHistoryWithCleanMocks>>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let sanitizeSessionHistory: SanitizeSessionHistory;

vi.mock("./pi-embedded-helpers.js", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await vi.importActual("./pi-embedded-helpers.js");
  return {
    ...actual,
    isGoogleModelApi: vi.fn(),
    sanitizeSessionMessagesImages: vi.fn().mockImplementation(async (msgs) => msgs),
  };
});

describe("sanitizeSessionHistory e2e smoke", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockSessionManager = makeMockSessionManager();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockMessages = makeSimpleUserMessages();

  beforeEach(async () => {
    sanitizeSessionHistory = await loadSanitizeSessionHistoryWithCleanMocks();
  });

  it("applies full sanitize policy for google model APIs", async () => {
    await expectGoogleModelApiFullSanitizeCall({
      sanitizeSessionHistory,
      messages: mockMessages,
      sessionManager: mockSessionManager,
    });
  });

  it("keeps images-only sanitize policy without tool-call id rewriting for openai-responses", async () => {
    vi.mocked(helpers.isGoogleModelApi).mockReturnValue(false);

    await sanitizeWithOpenAIResponses({
      sanitizeSessionHistory,
      messages: mockMessages,
      sessionManager: mockSessionManager,
    });

    expect(helpers.sanitizeSessionMessagesImages).toHaveBeenCalledWith(
      mockMessages,
      "session:history",
      expect.objectContaining({
        sanitizeMode: "images-only",
        sanitizeToolCallIds: false,
      }),
    );
  });

  it("downgrades openai reasoning blocks when the model snapshot changed", async () => {
    const { sessionManager, messages, modelId } = makeSnapshotChangedOpenAIReasoningScenario();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sanitizeWithOpenAIResponses({
      sanitizeSessionHistory,
      messages,
      modelId,
      sessionManager,
    });

    expect(result).toEqual([]);
  });
});
