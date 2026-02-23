/*
 * AUTO ANNOTATION
 * File: src/discord/send.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordWebMediaMockFactoryResult = {
  loadWebMedia: MockFn;
  loadWebMediaRaw: MockFn;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordRestFactoryResult = {
  rest: import("@buape/carbon").RequestClient;
  postMock: MockFn;
  putMock: MockFn;
  getMock: MockFn;
  patchMock: MockFn;
  deleteMock: MockFn;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function discordWebMediaMockFactory(): DiscordWebMediaMockFactoryResult {
  return {
    loadWebMedia: vi.fn().mockResolvedValue({
      buffer: Buffer.from("img"),
      fileName: "photo.jpg",
      contentType: "image/jpeg",
      kind: "image",
    }),
    loadWebMediaRaw: vi.fn().mockResolvedValue({
      buffer: Buffer.from("img"),
      fileName: "asset.png",
      contentType: "image/png",
      kind: "image",
    }),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeDiscordRest(): DiscordRestFactoryResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const postMock = vi.fn() as unknown as MockFn;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const putMock = vi.fn() as unknown as MockFn;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getMock = vi.fn() as unknown as MockFn;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const patchMock = vi.fn() as unknown as MockFn;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deleteMock = vi.fn() as unknown as MockFn;

  return {
    rest: {
      post: postMock,
      put: putMock,
      get: getMock,
      patch: patchMock,
      delete: deleteMock,
    } as unknown as import("@buape/carbon").RequestClient,
    postMock,
    putMock,
    getMock,
    patchMock,
    deleteMock,
  };
}
