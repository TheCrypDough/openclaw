/*
 * AUTO ANNOTATION
 * File: test/mocks/baileys.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BaileysExports = typeof import("@whiskeysockets/baileys");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type FetchLatestBaileysVersionFn = BaileysExports["fetchLatestBaileysVersion"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MakeCacheableSignalKeyStoreFn = BaileysExports["makeCacheableSignalKeyStore"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MakeWASocketFn = BaileysExports["makeWASocket"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UseMultiFileAuthStateFn = BaileysExports["useMultiFileAuthState"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DownloadMediaMessageFn = BaileysExports["downloadMediaMessage"];

export type MockBaileysSocket = {
  ev: EventEmitter;
  ws: { close: ReturnType<typeof vi.fn> };
  sendPresenceUpdate: ReturnType<typeof vi.fn>;
  sendMessage: ReturnType<typeof vi.fn>;
  readMessages: ReturnType<typeof vi.fn>;
  user?: { id?: string };
};

export type MockBaileysModule = {
  DisconnectReason: { loggedOut: number };
  fetchLatestBaileysVersion: ReturnType<typeof vi.fn<FetchLatestBaileysVersionFn>>;
  makeCacheableSignalKeyStore: ReturnType<typeof vi.fn<MakeCacheableSignalKeyStoreFn>>;
  makeWASocket: ReturnType<typeof vi.fn<MakeWASocketFn>>;
  useMultiFileAuthState: ReturnType<typeof vi.fn<UseMultiFileAuthStateFn>>;
  jidToE164?: (jid: string) => string | null;
  proto?: unknown;
  downloadMediaMessage?: ReturnType<typeof vi.fn<DownloadMediaMessageFn>>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMockBaileys(): {
  mod: MockBaileysModule;
  lastSocket: () => MockBaileysSocket;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sockets: MockBaileysSocket[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const makeWASocket = vi.fn<MakeWASocketFn>((_opts) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ev = new EventEmitter();
    const sock: MockBaileysSocket = {
      ev,
      ws: { close: vi.fn() },
      sendPresenceUpdate: vi.fn().mockResolvedValue(undefined),
      sendMessage: vi.fn().mockResolvedValue({ key: { id: "msg123" } }),
      readMessages: vi.fn().mockResolvedValue(undefined),
      user: { id: "123@s.whatsapp.net" },
    };
    setImmediate(() => ev.emit("connection.update", { connection: "open" }));
    sockets.push(sock);
    return sock as unknown as ReturnType<MakeWASocketFn>;
  });

  const mod: MockBaileysModule = {
    DisconnectReason: { loggedOut: 401 },
    fetchLatestBaileysVersion: vi
      .fn<FetchLatestBaileysVersionFn>()
      .mockResolvedValue({ version: [1, 2, 3], isLatest: true }),
    makeCacheableSignalKeyStore: vi.fn<MakeCacheableSignalKeyStoreFn>((keys) => keys),
    makeWASocket,
    useMultiFileAuthState: vi.fn<UseMultiFileAuthStateFn>(async () => ({
      state: { creds: {}, keys: {} } as Awaited<ReturnType<UseMultiFileAuthStateFn>>["state"],
      saveCreds: vi.fn(),
    })),
    jidToE164: (jid: string) => jid.replace(/@.*$/, "").replace(/^/, "+"),
    downloadMediaMessage: vi.fn<DownloadMediaMessageFn>().mockResolvedValue(Buffer.from("img")),
  };

  return {
    mod,
    lastSocket: () => {
      const last = sockets.at(-1);
      if (!last) {
        throw new Error("No Baileys sockets created");
      }
      return last;
    },
  };
}
