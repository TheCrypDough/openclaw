/*
 * AUTO ANNOTATION
 * File: src/web/monitor-inbox.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, vi } from "vitest";
import { resetLogger, setLoggerOverride } from "../logging.js";

// Avoid exporting vitest mock types (TS2742 under pnpm + d.ts emit).
// oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AnyMockFn = any;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_ACCOUNT_ID = "default";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_WEB_INBOX_CONFIG = {
  channels: {
    whatsapp: {
      // Allow all in tests by default.
      allowFrom: ["*"],
    },
  },
  messages: {
    messagePrefix: undefined,
    responsePrefix: undefined,
  },
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const mockLoadConfig: AnyMockFn = vi.fn().mockReturnValue(DEFAULT_WEB_INBOX_CONFIG);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const readAllowFromStoreMock: AnyMockFn = vi.fn().mockResolvedValue([]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const upsertPairingRequestMock: AnyMockFn = vi
  .fn()
  .mockResolvedValue({ code: "PAIRCODE", created: true });

export type MockSock = {
  ev: EventEmitter;
  ws: { close: AnyMockFn };
  sendPresenceUpdate: AnyMockFn;
  sendMessage: AnyMockFn;
  readMessages: AnyMockFn;
  updateMediaMessage: AnyMockFn;
  logger: Record<string, unknown>;
  signalRepository: {
    lidMapping: {
      getPNForLID: AnyMockFn;
    };
  };
  user: { id: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createMockSock(): MockSock {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ev = new EventEmitter();
  return {
    ev,
    ws: { close: vi.fn() },
    sendPresenceUpdate: vi.fn().mockResolvedValue(undefined),
    sendMessage: vi.fn().mockResolvedValue(undefined),
    readMessages: vi.fn().mockResolvedValue(undefined),
    updateMediaMessage: vi.fn(),
    logger: {},
    signalRepository: {
      lidMapping: {
        getPNForLID: vi.fn().mockResolvedValue(null),
      },
    },
    user: { id: "123@s.whatsapp.net" },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sock: MockSock = createMockSock();

vi.mock("../media/store.js", () => ({
  saveMediaBuffer: vi.fn().mockResolvedValue({
    id: "mid",
    path: "/tmp/mid",
    size: 1,
    contentType: "image/jpeg",
  }),
}));

vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => mockLoadConfig(),
  };
});

vi.mock("../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: (...args: unknown[]) => readAllowFromStoreMock(...args),
  upsertChannelPairingRequest: (...args: unknown[]) => upsertPairingRequestMock(...args),
}));

vi.mock("./session.js", () => ({
  createWaSocket: vi.fn().mockResolvedValue(sock),
  waitForWaConnection: vi.fn().mockResolvedValue(undefined),
  getStatusCode: vi.fn(() => 500),
}));

export function getSock(): MockSock {
  return sock;
}

let authDir: string | undefined;

export function getAuthDir(): string {
  if (!authDir) {
    throw new Error("authDir not initialized; call installWebMonitorInboxUnitTestHooks()");
  }
  return authDir;
}

export function installWebMonitorInboxUnitTestHooks(opts?: { authDir?: boolean }) {
  const createAuthDir = opts?.authDir ?? true;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLoadConfig.mockReturnValue(DEFAULT_WEB_INBOX_CONFIG);
    readAllowFromStoreMock.mockResolvedValue([]);
    upsertPairingRequestMock.mockResolvedValue({
      code: "PAIRCODE",
      created: true,
    });
    const { resetWebInboundDedupe } = await import("./inbound.js");
    resetWebInboundDedupe();
    if (createAuthDir) {
      authDir = fsSync.mkdtempSync(path.join(os.tmpdir(), "openclaw-auth-"));
    } else {
      authDir = undefined;
    }
  });

  afterEach(() => {
    resetLogger();
    setLoggerOverride(null);
    vi.useRealTimers();
    if (authDir) {
      fsSync.rmSync(authDir, { recursive: true, force: true });
      authDir = undefined;
    }
  });
}
