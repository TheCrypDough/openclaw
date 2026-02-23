/*
 * AUTO ANNOTATION
 * File: src/telegram/bot.media.e2e-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, vi, type Mock } from "vitest";
import { resetInboundDedupe } from "../auto-reply/reply/inbound-dedupe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const useSpy: Mock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const middlewareUseSpy: Mock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const onSpy: Mock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const stopSpy: Mock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const sendChatActionSpy: Mock = vi.fn();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ApiStub = {
  config: { use: (arg: unknown) => void };
  sendChatAction: Mock;
  setMyCommands: (commands: Array<{ command: string; description: string }>) => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const apiStub: ApiStub = {
  config: { use: useSpy },
  sendChatAction: sendChatActionSpy,
  setMyCommands: vi.fn(async () => undefined),
};

beforeEach(() => {
  resetInboundDedupe();
});

vi.mock("grammy", () => ({
  Bot: class {
    api = apiStub;
    use = middlewareUseSpy;
    on = onSpy;
    command = vi.fn();
    stop = stopSpy;
    catch = vi.fn();
    constructor(public token: string) {}
  },
  InputFile: class {},
  webhookCallback: vi.fn(),
}));

vi.mock("@grammyjs/runner", () => ({
  sequentialize: () => vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const throttlerSpy = vi.fn(() => "throttler");
vi.mock("@grammyjs/transformer-throttler", () => ({
  apiThrottler: () => throttlerSpy(),
}));

vi.mock("../media/store.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../media/store.js")>();
  return {
    ...actual,
    saveMediaBuffer: vi.fn(async (buffer: Buffer, contentType?: string) => ({
      id: "media",
      path: "/tmp/telegram-media",
      size: buffer.byteLength,
      contentType: contentType ?? "application/octet-stream",
    })),
  };
});

vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => ({
      channels: { telegram: { dmPolicy: "open", allowFrom: ["*"] } },
    }),
  };
});

vi.mock("../config/sessions.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../config/sessions.js")>();
  return {
    ...actual,
    updateLastRoute: vi.fn(async () => undefined),
  };
});

vi.mock("../pairing/pairing-store.js", () => ({
  readChannelAllowFromStore: vi.fn(async () => [] as string[]),
  upsertChannelPairingRequest: vi.fn(async () => ({
    code: "PAIRCODE",
    created: true,
  })),
}));

vi.mock("../auto-reply/reply.js", () => {
  const replySpy = vi.fn(async (_ctx, opts) => {
    await opts?.onReplyStart?.();
    return undefined;
  });
  return { getReplyFromConfig: replySpy, __replySpy: replySpy };
});
