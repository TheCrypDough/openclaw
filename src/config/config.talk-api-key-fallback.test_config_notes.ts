# AUTOPLACEHOLDER_ANNOTATION: src/config/config.talk-api-key-fallback.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type fs from "node:fs";
import type os from "node:os";
import type path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { resolveTalkApiKey } from "./talk.js";

describe("talk api key fallback", () => {
  it("reads ELEVENLABS_API_KEY from profile when env is missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existsSync = vi.fn((candidate: string) => candidate.endsWith(".profile"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const readFileSync = vi.fn(() => "export ELEVENLABS_API_KEY=profile-key\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const homedir = vi.fn(() => "/tmp/home");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = resolveTalkApiKey(
      {},
      {
        fs: { existsSync, readFileSync } as unknown as typeof fs,
        os: { homedir } as unknown as typeof os,
        path: { join: (...parts: string[]) => parts.join("/") } as unknown as typeof path,
      },
    );

    expect(value).toBe("profile-key");
    expect(readFileSync).toHaveBeenCalledOnce();
  });

  it("prefers ELEVENLABS_API_KEY env over profile", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existsSync = vi.fn(() => {
      throw new Error("profile should not be read when env key exists");
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const readFileSync = vi.fn(() => "");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = resolveTalkApiKey(
      { ELEVENLABS_API_KEY: "env-key" },
      {
        fs: { existsSync, readFileSync } as unknown as typeof fs,
        os: { homedir: () => "/tmp/home" } as unknown as typeof os,
        path: { join: (...parts: string[]) => parts.join("/") } as unknown as typeof path,
      },
    );

    expect(value).toBe("env-key");
    expect(existsSync).not.toHaveBeenCalled();
    expect(readFileSync).not.toHaveBeenCalled();
  });
});
