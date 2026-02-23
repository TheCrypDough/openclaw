/*
 * AUTO ANNOTATION
 * File: src/slack/client.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@slack/web-api", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const WebClient = vi.fn(function WebClientMock(
    this: Record<string, unknown>,
    token: string,
    options?: Record<string, unknown>,
  ) {
    this.token = token;
    this.options = options;
  });
  return { WebClient };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const slackWebApi = await import("@slack/web-api");
const { createSlackWebClient, resolveSlackWebClientOptions, SLACK_DEFAULT_RETRY_OPTIONS } =
  await import("./client.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WebClient = slackWebApi.WebClient as unknown as ReturnType<typeof vi.fn>;

describe("slack web client config", () => {
  it("applies the default retry config when none is provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = resolveSlackWebClientOptions();

    expect(options.retryConfig).toEqual(SLACK_DEFAULT_RETRY_OPTIONS);
  });

  it("respects explicit retry config overrides", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const customRetry = { retries: 0 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = resolveSlackWebClientOptions({ retryConfig: customRetry });

    expect(options.retryConfig).toBe(customRetry);
  });

  it("passes merged options into WebClient", () => {
    createSlackWebClient("xoxb-test", { timeout: 1234 });

    expect(WebClient).toHaveBeenCalledWith(
      "xoxb-test",
      expect.objectContaining({
        timeout: 1234,
        retryConfig: SLACK_DEFAULT_RETRY_OPTIONS,
      }),
    );
  });
});
