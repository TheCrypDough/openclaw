/*
 * AUTO ANNOTATION
 * File: src/gateway/server.skills-status.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import { connectOk, installGatewayTestHooks, rpcReq } from "./test-helpers.js";
import { withServer } from "./test-with-server.js";

installGatewayTestHooks({ scope: "suite" });

describe("gateway skills.status", () => {
  it("does not expose raw config values to operator.read clients", async () => {
    await withEnvAsync(
      { OPENCLAW_BUNDLED_SKILLS_DIR: path.join(process.cwd(), "skills") },
      async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const secret = "discord-token-secret-abc";
        const { writeConfigFile } = await import("../config/config.js");
        await writeConfigFile({
          session: { mainKey: "main-test" },
          channels: {
            discord: {
              token: secret,
            },
          },
        });

        await withServer(async (ws) => {
          await connectOk(ws, { token: "secret", scopes: ["operator.read"] });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const res = await rpcReq<{
            skills?: Array<{
              name?: string;
              configChecks?: Array<
                { path?: string; satisfied?: boolean } & Record<string, unknown>
              >;
            }>;
          }>(ws, "skills.status", {});

          expect(res.ok).toBe(true);
          expect(JSON.stringify(res.payload)).not.toContain(secret);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const discord = res.payload?.skills?.find((s) => s.name === "discord");
          expect(discord).toBeTruthy();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const check = discord?.configChecks?.find((c) => c.path === "channels.discord.token");
          expect(check).toBeTruthy();
          expect(check?.satisfied).toBe(true);
          expect(check && "value" in check).toBe(false);
        });
      },
    );
  });
});
