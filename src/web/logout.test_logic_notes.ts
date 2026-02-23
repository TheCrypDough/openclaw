/*
 * AUTO ANNOTATION
 * File: src/web/logout.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runtime = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(),
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WEB_LOGOUT_TEST_TIMEOUT_MS = 15_000;

describe("web logout", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let fixtureRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let caseId = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let logoutWeb: typeof import("./auth-store.js").logoutWeb;

  beforeAll(async () => {
    fixtureRoot = await fsPromises.mkdtemp(path.join(os.tmpdir(), "openclaw-test-web-logout-"));
    ({ logoutWeb } = await import("./auth-store.js"));
  });

  afterAll(async () => {
    await fsPromises.rm(fixtureRoot, { recursive: true, force: true });
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const makeCaseDir = async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dir = path.join(fixtureRoot, `case-${caseId++}`);
    await fsPromises.mkdir(dir, { recursive: true });
    return dir;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createAuthCase = async (files: Record<string, string>) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authDir = await makeCaseDir();
    await Promise.all(
      Object.entries(files).map(async ([name, contents]) => {
        await fsPromises.writeFile(path.join(authDir, name), contents, "utf-8");
      }),
    );
    return authDir;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(
    "deletes cached credentials when present",
    { timeout: WEB_LOGOUT_TEST_TIMEOUT_MS },
    async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const authDir = await createAuthCase({ "creds.json": "{}" });
      const result = await logoutWeb({ authDir, runtime: runtime as never });
      expect(result).toBe(true);
      expect(fs.existsSync(authDir)).toBe(false);
    },
  );

  it("removes oauth.json too when not using legacy auth dir", async () => {
    const authDir = await createAuthCase({
      "creds.json": "{}",
      "oauth.json": '{"token":true}',
      "session-abc.json": "{}",
    });
    const result = await logoutWeb({ authDir, runtime: runtime as never });
    expect(result).toBe(true);
    expect(fs.existsSync(authDir)).toBe(false);
  });

  it("no-ops when nothing to delete", { timeout: WEB_LOGOUT_TEST_TIMEOUT_MS }, async () => {
    const authDir = await makeCaseDir();
    const result = await logoutWeb({ authDir, runtime: runtime as never });
    expect(result).toBe(false);
    expect(runtime.log).toHaveBeenCalled();
  });

  it("keeps shared oauth.json when using legacy auth dir", async () => {
    const credsDir = await createAuthCase({
      "creds.json": "{}",
      "oauth.json": '{"token":true}',
      "session-abc.json": "{}",
    });

    const result = await logoutWeb({
      authDir: credsDir,
      isLegacyAuthDir: true,
      runtime: runtime as never,
    });
    expect(result).toBe(true);
    expect(fs.existsSync(path.join(credsDir, "oauth.json"))).toBe(true);
    expect(fs.existsSync(path.join(credsDir, "creds.json"))).toBe(false);
    expect(fs.existsSync(path.join(credsDir, "session-abc.json"))).toBe(false);
  });
});
