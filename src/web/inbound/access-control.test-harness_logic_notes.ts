/*
 * AUTO ANNOTATION
 * File: src/web/inbound/access-control.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, vi } from "vitest";

type AsyncMock<TArgs extends unknown[] = unknown[], TResult = unknown> = {
  (...args: TArgs): Promise<TResult>;
  mockReset: () => AsyncMock<TArgs, TResult>;
  mockResolvedValue: (value: TResult) => AsyncMock<TArgs, TResult>;
  mockResolvedValueOnce: (value: TResult) => AsyncMock<TArgs, TResult>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const sendMessageMock = vi.fn() as AsyncMock;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const readAllowFromStoreMock = vi.fn() as AsyncMock;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const upsertPairingRequestMock = vi.fn() as AsyncMock;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let config: Record<string, unknown> = {};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setAccessControlTestConfig(next: Record<string, unknown>): void {
  config = next;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setupAccessControlTestHarness(): void {
  beforeEach(() => {
    config = {
      channels: {
        whatsapp: {
          dmPolicy: "pairing",
          allowFrom: [],
        },
      },
    };
    sendMessageMock.mockReset().mockResolvedValue(undefined);
    readAllowFromStoreMock.mockReset().mockResolvedValue([]);
    upsertPairingRequestMock.mockReset().mockResolvedValue({ code: "PAIRCODE", created: true });
  });
}

vi.mock("../../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => config,
  };
});

vi.mock("../../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: (...args: unknown[]) => readAllowFromStoreMock(...args),
  upsertChannelPairingRequest: (...args: unknown[]) => upsertPairingRequestMock(...args),
}));
