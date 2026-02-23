# AUTOPLACEHOLDER_ANNOTATION: src/gateway/server.talk-config.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { connectOk, installGatewayTestHooks, rpcReq } from "./test-helpers.js";
import { withServer } from "./test-with-server.js";

installGatewayTestHooks({ scope: "suite" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function createFreshOperatorDevice(scopes: string[]) {
  const { randomUUID } = await import("node:crypto");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { buildDeviceAuthPayload } = await import("./device-auth.js");
  const { loadOrCreateDeviceIdentity, publicKeyRawBase64UrlFromPem, signDevicePayload } =
    await import("../infra/device-identity.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const identity = loadOrCreateDeviceIdentity(
    join(tmpdir(), `openclaw-talk-config-${randomUUID()}.json`),
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const signedAtMs = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = buildDeviceAuthPayload({
    deviceId: identity.deviceId,
    clientId: "test",
    clientMode: "test",
    role: "operator",
    scopes,
    signedAtMs,
    token: "secret",
  });

  return {
    id: identity.deviceId,
    publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
    signature: signDevicePayload(identity.privateKeyPem, payload),
    signedAt: signedAtMs,
  };
}

describe("gateway talk.config", () => {
  it("returns redacted talk config for read scope", async () => {
    const { writeConfigFile } = await import("../config/config.js");
    await writeConfigFile({
      talk: {
        voiceId: "voice-123",
        apiKey: "secret-key-abc",
      },
      session: {
        mainKey: "main-test",
      },
      ui: {
        seamColor: "#112233",
      },
    });

    await withServer(async (ws) => {
      await connectOk(ws, {
        token: "secret",
        scopes: ["operator.read"],
        device: await createFreshOperatorDevice(["operator.read"]),
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await rpcReq<{ config?: { talk?: { apiKey?: string; voiceId?: string } } }>(
        ws,
        "talk.config",
        {},
      );
      expect(res.ok).toBe(true);
      expect(res.payload?.config?.talk?.voiceId).toBe("voice-123");
      expect(res.payload?.config?.talk?.apiKey).toBe("__OPENCLAW_REDACTED__");
    });
  });

  it("requires operator.talk.secrets for includeSecrets", async () => {
    const { writeConfigFile } = await import("../config/config.js");
    await writeConfigFile({
      talk: {
        apiKey: "secret-key-abc",
      },
    });

    await withServer(async (ws) => {
      await connectOk(ws, {
        token: "secret",
        scopes: ["operator.read"],
        device: await createFreshOperatorDevice(["operator.read"]),
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await rpcReq(ws, "talk.config", { includeSecrets: true });
      expect(res.ok).toBe(false);
      expect(res.error?.message).toContain("missing scope: operator.talk.secrets");
    });
  });

  it("returns secrets for operator.talk.secrets scope", async () => {
    const { writeConfigFile } = await import("../config/config.js");
    await writeConfigFile({
      talk: {
        apiKey: "secret-key-abc",
      },
    });

    await withServer(async (ws) => {
      await connectOk(ws, {
        token: "secret",
        scopes: ["operator.read", "operator.write", "operator.talk.secrets"],
        device: await createFreshOperatorDevice([
          "operator.read",
          "operator.write",
          "operator.talk.secrets",
        ]),
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await rpcReq<{ config?: { talk?: { apiKey?: string } } }>(ws, "talk.config", {
        includeSecrets: true,
      });
      expect(res.ok).toBe(true);
      expect(res.payload?.config?.talk?.apiKey).toBe("secret-key-abc");
    });
  });
});
