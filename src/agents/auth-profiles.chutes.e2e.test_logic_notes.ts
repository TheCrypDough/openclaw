/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles.chutes.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import {
  type AuthProfileStore,
  ensureAuthProfileStore,
  resolveApiKeyForProfile,
} from "./auth-profiles.js";
import { CHUTES_TOKEN_ENDPOINT } from "./chutes-oauth.js";

describe("auth-profiles (chutes)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let tempDir: string | null = null;

  afterEach(async () => {
    vi.unstubAllGlobals();
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("refreshes expired Chutes OAuth credentials", async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-chutes-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = path.join(tempDir, "agents", "main", "agent");
    await withEnvAsync(
      {
        OPENCLAW_STATE_DIR: tempDir,
        OPENCLAW_AGENT_DIR: agentDir,
        PI_CODING_AGENT_DIR: agentDir,
        CHUTES_CLIENT_ID: undefined,
      },
      async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const authProfilePath = path.join(agentDir, "auth-profiles.json");
        await fs.mkdir(path.dirname(authProfilePath), { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const store: AuthProfileStore = {
          version: 1,
          profiles: {
            "chutes:default": {
              type: "oauth",
              provider: "chutes",
              access: "at_old",
              refresh: "rt_old",
              expires: Date.now() - 60_000,
              clientId: "cid_test",
            },
          },
        };
        await fs.writeFile(authProfilePath, `${JSON.stringify(store)}\n`);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const fetchSpy = vi.fn(async (input: string | URL) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const url = typeof input === "string" ? input : input.toString();
          if (url !== CHUTES_TOKEN_ENDPOINT) {
            return new Response("not found", { status: 404 });
          }
          return new Response(
            JSON.stringify({
              access_token: "at_new",
              expires_in: 3600,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        });
        vi.stubGlobal("fetch", fetchSpy);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const loaded = ensureAuthProfileStore();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const resolved = await resolveApiKeyForProfile({
          store: loaded,
          profileId: "chutes:default",
        });

        expect(resolved?.apiKey).toBe("at_new");
        expect(fetchSpy).toHaveBeenCalled();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const persisted = JSON.parse(await fs.readFile(authProfilePath, "utf8")) as {
          profiles?: Record<string, { access?: string }>;
        };
        expect(persisted.profiles?.["chutes:default"]?.access).toBe("at_new");
      },
    );
  });
});
