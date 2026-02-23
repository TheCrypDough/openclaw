/*
 * AUTO ANNOTATION
 * File: src/slack/blocks.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebClient } from "@slack/web-api";
import { vi } from "vitest";

export type SlackEditTestClient = WebClient & {
  chat: {
    update: ReturnType<typeof vi.fn>;
  };
};

export type SlackSendTestClient = WebClient & {
  conversations: {
    open: ReturnType<typeof vi.fn>;
  };
  chat: {
    postMessage: ReturnType<typeof vi.fn>;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installSlackBlockTestMocks() {
  vi.mock("../config/config.js", () => ({
    loadConfig: () => ({}),
  }));

  vi.mock("./accounts.js", () => ({
    resolveSlackAccount: () => ({
      accountId: "default",
      botToken: "xoxb-test",
      botTokenSource: "config",
      config: {},
    }),
  }));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSlackEditTestClient(): SlackEditTestClient {
  return {
    chat: {
      update: vi.fn(async () => ({ ok: true })),
    },
  } as unknown as SlackEditTestClient;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSlackSendTestClient(): SlackSendTestClient {
  return {
    conversations: {
      open: vi.fn(async () => ({ channel: { id: "D123" } })),
    },
    chat: {
      postMessage: vi.fn(async () => ({ ts: "171234.567" })),
    },
  } as unknown as SlackSendTestClient;
}
