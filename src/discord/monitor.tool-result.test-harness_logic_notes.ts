/*
 * AUTO ANNOTATION
 * File: src/discord/monitor.tool-result.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const sendMock: MockFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const reactMock: MockFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const updateLastRouteMock: MockFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const dispatchMock: MockFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const readAllowFromStoreMock: MockFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const upsertPairingRequestMock: MockFn = vi.fn();

vi.mock("./send.js", () => ({
  sendMessageDiscord: (...args: unknown[]) => sendMock(...args),
  reactMessageDiscord: async (...args: unknown[]) => {
    reactMock(...args);
  },
}));

vi.mock("../auto-reply/dispatch.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../auto-reply/dispatch.js")>();
  return {
    ...actual,
    dispatchInboundMessage: (...args: unknown[]) => dispatchMock(...args),
    dispatchInboundMessageWithDispatcher: (...args: unknown[]) => dispatchMock(...args),
    dispatchInboundMessageWithBufferedDispatcher: (...args: unknown[]) => dispatchMock(...args),
  };
});

vi.mock("../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: (...args: unknown[]) => readAllowFromStoreMock(...args),
  upsertChannelPairingRequest: (...args: unknown[]) => upsertPairingRequestMock(...args),
}));

vi.mock("../config/sessions.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/sessions.js")>();
  return {
    ...actual,
    resolveStorePath: vi.fn(() => "/tmp/openclaw-sessions.json"),
    updateLastRoute: (...args: unknown[]) => updateLastRouteMock(...args),
    resolveSessionKey: vi.fn(),
  };
});
