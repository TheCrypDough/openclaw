/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/slash.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  dispatchMock: vi.fn(),
  readAllowFromStoreMock: vi.fn(),
  upsertPairingRequestMock: vi.fn(),
  resolveAgentRouteMock: vi.fn(),
  finalizeInboundContextMock: vi.fn(),
  resolveConversationLabelMock: vi.fn(),
  createReplyPrefixOptionsMock: vi.fn(),
}));

vi.mock("../../auto-reply/reply/provider-dispatcher.js", () => ({
  dispatchReplyWithDispatcher: (...args: unknown[]) => mocks.dispatchMock(...args),
}));

vi.mock("../../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: (...args: unknown[]) => mocks.readAllowFromStoreMock(...args),
  upsertChannelPairingRequest: (...args: unknown[]) => mocks.upsertPairingRequestMock(...args),
}));

vi.mock("../../routing/resolve-route.js", () => ({
  resolveAgentRoute: (...args: unknown[]) => mocks.resolveAgentRouteMock(...args),
}));

vi.mock("../../auto-reply/reply/inbound-context.js", () => ({
  finalizeInboundContext: (...args: unknown[]) => mocks.finalizeInboundContextMock(...args),
}));

vi.mock("../../channels/conversation-label.js", () => ({
  resolveConversationLabel: (...args: unknown[]) => mocks.resolveConversationLabelMock(...args),
}));

vi.mock("../../channels/reply-prefix.js", () => ({
  createReplyPrefixOptions: (...args: unknown[]) => mocks.createReplyPrefixOptionsMock(...args),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlashHarnessMocks = {
  dispatchMock: ReturnType<typeof vi.fn>;
  readAllowFromStoreMock: ReturnType<typeof vi.fn>;
  upsertPairingRequestMock: ReturnType<typeof vi.fn>;
  resolveAgentRouteMock: ReturnType<typeof vi.fn>;
  finalizeInboundContextMock: ReturnType<typeof vi.fn>;
  resolveConversationLabelMock: ReturnType<typeof vi.fn>;
  createReplyPrefixOptionsMock: ReturnType<typeof vi.fn>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getSlackSlashMocks(): SlashHarnessMocks {
  return mocks;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetSlackSlashMocks() {
  mocks.dispatchMock.mockReset().mockResolvedValue({ counts: { final: 1, tool: 0, block: 0 } });
  mocks.readAllowFromStoreMock.mockReset().mockResolvedValue([]);
  mocks.upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
  mocks.resolveAgentRouteMock.mockReset().mockReturnValue({
    agentId: "main",
    sessionKey: "session:1",
    accountId: "acct",
  });
  mocks.finalizeInboundContextMock.mockReset().mockImplementation((ctx: unknown) => ctx);
  mocks.resolveConversationLabelMock.mockReset().mockReturnValue(undefined);
  mocks.createReplyPrefixOptionsMock.mockReset().mockReturnValue({ onModelSelected: () => {} });
}
