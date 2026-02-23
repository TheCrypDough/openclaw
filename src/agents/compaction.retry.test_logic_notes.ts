/*
 * AUTO ANNOTATION
 * File: src/agents/compaction.retry.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import * as piCodingAgent from "@mariozechner/pi-coding-agent";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { retryAsync } from "../infra/retry.js";

// Mock the external generateSummary function
vi.mock("@mariozechner/pi-coding-agent", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof piCodingAgent>();
  return {
    ...actual,
    generateSummary: vi.fn(),
  };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mockGenerateSummary = vi.mocked(piCodingAgent.generateSummary);

describe("compaction retry integration", () => {
  beforeEach(() => {
    mockGenerateSummary.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const testMessages = [
    { role: "user", content: "Test message" },
    { role: "assistant", content: "Test response" },
  ] as unknown as AgentMessage[];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const testModel = {
    provider: "anthropic",
    model: "claude-3-opus",
  } as unknown as NonNullable<ExtensionContext["model"]>;

  it("should successfully call generateSummary with retry wrapper", async () => {
    mockGenerateSummary.mockResolvedValueOnce("Test summary");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await retryAsync(
      () =>
        mockGenerateSummary(
          testMessages,
          testModel,
          1000,
          "test-api-key",
          new AbortController().signal,
        ),
      {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 5000,
        jitter: 0.2,
        label: "compaction/generateSummary",
      },
    );

    expect(result).toBe("Test summary");
    expect(mockGenerateSummary).toHaveBeenCalledTimes(1);
  });

  it("should retry on transient error and succeed", async () => {
    mockGenerateSummary
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockResolvedValueOnce("Success after retry");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await retryAsync(
      () =>
        mockGenerateSummary(
          testMessages,
          testModel,
          1000,
          "test-api-key",
          new AbortController().signal,
        ),
      {
        attempts: 3,
        minDelayMs: 0,
        maxDelayMs: 0,
        label: "compaction/generateSummary",
      },
    );

    expect(result).toBe("Success after retry");
    expect(mockGenerateSummary).toHaveBeenCalledTimes(2);
  });

  it("should NOT retry on user abort", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const abortErr = new Error("aborted");
    abortErr.name = "AbortError";
    (abortErr as { cause?: unknown }).cause = { source: "user" };

    mockGenerateSummary.mockRejectedValueOnce(abortErr);

    await expect(
      retryAsync(
        () =>
          mockGenerateSummary(
            testMessages,
            testModel,
            1000,
            "test-api-key",
            new AbortController().signal,
          ),
        {
          attempts: 3,
          minDelayMs: 0,
          label: "compaction/generateSummary",
          shouldRetry: (err: unknown) => !(err instanceof Error && err.name === "AbortError"),
        },
      ),
    ).rejects.toThrow("aborted");

    // Should NOT retry on user cancellation (AbortError filtered by shouldRetry)
    expect(mockGenerateSummary).toHaveBeenCalledTimes(1);
  });

  it("should retry up to 3 times and then fail", async () => {
    mockGenerateSummary.mockRejectedValue(new Error("Persistent API error"));

    await expect(
      retryAsync(
        () =>
          mockGenerateSummary(
            testMessages,
            testModel,
            1000,
            "test-api-key",
            new AbortController().signal,
          ),
        {
          attempts: 3,
          minDelayMs: 0,
          maxDelayMs: 0,
          label: "compaction/generateSummary",
        },
      ),
    ).rejects.toThrow("Persistent API error");

    expect(mockGenerateSummary).toHaveBeenCalledTimes(3);
  });

  it("should apply exponential backoff", async () => {
    vi.useFakeTimers();

    mockGenerateSummary
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockRejectedValueOnce(new Error("Error 2"))
      .mockResolvedValueOnce("Success on 3rd attempt");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const delays: number[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const promise = retryAsync(
      () =>
        mockGenerateSummary(
          testMessages,
          testModel,
          1000,
          "test-api-key",
          new AbortController().signal,
        ),
      {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 5000,
        jitter: 0,
        label: "compaction/generateSummary",
        onRetry: (info) => delays.push(info.delayMs),
      },
    );

    await vi.runAllTimersAsync();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await promise;

    expect(result).toBe("Success on 3rd attempt");
    expect(mockGenerateSummary).toHaveBeenCalledTimes(3);
    // First retry: 500ms, second retry: 1000ms
    expect(delays[0]).toBe(500);
    expect(delays[1]).toBe(1000);

    vi.useRealTimers();
  });
});
