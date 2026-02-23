/*
 * AUTO ANNOTATION
 * File: src/infra/shell-env.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  getShellPathFromLoginShell,
  loadShellEnvFallback,
  resetShellPathCacheForTests,
  resolveShellEnvFallbackTimeoutMs,
  shouldEnableShellEnvFallback,
} from "./shell-env.js";

describe("shell env fallback", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function getShellPathTwice(params: {
    exec: Parameters<typeof getShellPathFromLoginShell>[0]["exec"];
    platform: NodeJS.Platform;
  }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = getShellPathFromLoginShell({
      env: {} as NodeJS.ProcessEnv,
      exec: params.exec,
      platform: params.platform,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = getShellPathFromLoginShell({
      env: {} as NodeJS.ProcessEnv,
      exec: params.exec,
      platform: params.platform,
    });
    return { first, second };
  }

  it("is disabled by default", () => {
    expect(shouldEnableShellEnvFallback({} as NodeJS.ProcessEnv)).toBe(false);
    expect(shouldEnableShellEnvFallback({ OPENCLAW_LOAD_SHELL_ENV: "0" })).toBe(false);
    expect(shouldEnableShellEnvFallback({ OPENCLAW_LOAD_SHELL_ENV: "1" })).toBe(true);
  });

  it("resolves timeout from env with default fallback", () => {
    expect(resolveShellEnvFallbackTimeoutMs({} as NodeJS.ProcessEnv)).toBe(15000);
    expect(resolveShellEnvFallbackTimeoutMs({ OPENCLAW_SHELL_ENV_TIMEOUT_MS: "42" })).toBe(42);
    expect(
      resolveShellEnvFallbackTimeoutMs({
        OPENCLAW_SHELL_ENV_TIMEOUT_MS: "nope",
      }),
    ).toBe(15000);
  });

  it("skips when already has an expected key", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env: NodeJS.ProcessEnv = { OPENAI_API_KEY: "set" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exec = vi.fn(() => Buffer.from(""));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
      exec: exec as unknown as Parameters<typeof loadShellEnvFallback>[0]["exec"],
    });

    expect(res.ok).toBe(true);
    expect(res.applied).toEqual([]);
    expect(res.ok && res.skippedReason).toBe("already-has-keys");
    expect(exec).not.toHaveBeenCalled();
  });

  it("imports expected keys without overriding existing env", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env: NodeJS.ProcessEnv = {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exec = vi.fn(() => Buffer.from("OPENAI_API_KEY=from-shell\0DISCORD_BOT_TOKEN=discord\0"));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res1 = loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
      exec: exec as unknown as Parameters<typeof loadShellEnvFallback>[0]["exec"],
    });

    expect(res1.ok).toBe(true);
    expect(env.OPENAI_API_KEY).toBe("from-shell");
    expect(env.DISCORD_BOT_TOKEN).toBe("discord");
    expect(exec).toHaveBeenCalledTimes(1);

    env.OPENAI_API_KEY = "from-parent";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exec2 = vi.fn(() =>
      Buffer.from("OPENAI_API_KEY=from-shell\0DISCORD_BOT_TOKEN=discord2\0"),
    );
    const res2 = loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"],
      exec: exec2 as unknown as Parameters<typeof loadShellEnvFallback>[0]["exec"],
    });

    expect(res2.ok).toBe(true);
    expect(env.OPENAI_API_KEY).toBe("from-parent");
    expect(env.DISCORD_BOT_TOKEN).toBe("discord");
    expect(exec2).not.toHaveBeenCalled();
  });

  it("resolves PATH via login shell and caches it", () => {
    resetShellPathCacheForTests();
    const exec = vi.fn(() => Buffer.from("PATH=/usr/local/bin:/usr/bin\0HOME=/tmp\0"));

    const { first, second } = getShellPathTwice({
      exec: exec as unknown as Parameters<typeof getShellPathFromLoginShell>[0]["exec"],
      platform: "linux",
    });

    expect(first).toBe("/usr/local/bin:/usr/bin");
    expect(second).toBe("/usr/local/bin:/usr/bin");
    expect(exec).toHaveBeenCalledOnce();
  });

  it("returns null on shell env read failure and caches null", () => {
    resetShellPathCacheForTests();
    const exec = vi.fn(() => {
      throw new Error("exec failed");
    });

    const { first, second } = getShellPathTwice({
      exec: exec as unknown as Parameters<typeof getShellPathFromLoginShell>[0]["exec"],
      platform: "linux",
    });

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(exec).toHaveBeenCalledOnce();
  });

  it("falls back to /bin/sh when SHELL is non-absolute", () => {
    const env: NodeJS.ProcessEnv = { SHELL: "zsh" };
    const exec = vi.fn(() => Buffer.from("OPENAI_API_KEY=from-shell\0"));

    const res = loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: ["OPENAI_API_KEY"],
      exec: exec as unknown as Parameters<typeof loadShellEnvFallback>[0]["exec"],
    });

    expect(res.ok).toBe(true);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith("/bin/sh", ["-l", "-c", "env -0"], expect.any(Object));
  });

  it("falls back to /bin/sh when SHELL points to an untrusted path", () => {
    const env: NodeJS.ProcessEnv = { SHELL: "/tmp/evil-shell" };
    const exec = vi.fn(() => Buffer.from("OPENAI_API_KEY=from-shell\0"));

    const res = loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: ["OPENAI_API_KEY"],
      exec: exec as unknown as Parameters<typeof loadShellEnvFallback>[0]["exec"],
    });

    expect(res.ok).toBe(true);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith("/bin/sh", ["-l", "-c", "env -0"], expect.any(Object));
  });

  it("returns null without invoking shell on win32", () => {
    resetShellPathCacheForTests();
    const exec = vi.fn(() => Buffer.from("PATH=/usr/local/bin:/usr/bin\0HOME=/tmp\0"));

    const { first, second } = getShellPathTwice({
      exec: exec as unknown as Parameters<typeof getShellPathFromLoginShell>[0]["exec"],
      platform: "win32",
    });

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(exec).not.toHaveBeenCalled();
  });
});
