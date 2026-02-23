# AUTOPLACEHOLDER_ANNOTATION: src/auto-reply/reply.triggers.trigger-handling.shows-endpoint-default-model-status-not-configured.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { beforeAll, describe, expect, it } from "vitest";
import { normalizeTestText } from "../../test/helpers/normalize-text.js";
import type { OpenClawConfig } from "../config/config.js";
import {
  getRunEmbeddedPiAgentMock,
  installTriggerHandlingE2eTestHooks,
  makeCfg,
  withTempHome,
} from "./reply.triggers.trigger-handling.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
beforeAll(async () => {
  ({ getReplyFromConfig } = await import("./reply.js"));
});

installTriggerHandlingE2eTestHooks();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const modelStatusCtx = {
  Body: "/model status",
  From: "telegram:111",
  To: "telegram:111",
  ChatType: "direct",
  Provider: "telegram",
  Surface: "telegram",
  SessionKey: "telegram:slash:111",
  CommandAuthorized: true,
} as const;

describe("trigger handling", () => {
  it("shows endpoint default in /model status when not configured", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = makeCfg(home);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(modelStatusCtx, {}, cfg);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(normalizeTestText(text ?? "")).toContain("endpoint: default");
    });
  });
  it("includes endpoint details in /model status when configured", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = {
        ...makeCfg(home),
        models: {
          providers: {
            minimax: {
              baseUrl: "https://api.minimax.io/anthropic",
              api: "anthropic-messages",
            },
          },
        },
      } as unknown as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(modelStatusCtx, {}, cfg);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalized = normalizeTestText(text ?? "");
      expect(normalized).toContain(
        "[minimax] endpoint: https://api.minimax.io/anthropic api: anthropic-messages auth:",
      );
    });
  });
  it("restarts by default", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const runEmbeddedPiAgentMock = getRunEmbeddedPiAgentMock();
      const res = await getReplyFromConfig(
        {
          Body: "  [Dec 5] /restart",
          From: "+1001",
          To: "+2000",
          CommandAuthorized: true,
        },
        {},
        makeCfg(home),
      );
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text?.startsWith("⚙️ Restarting") || text?.startsWith("⚠️ Restart failed")).toBe(true);
      expect(runEmbeddedPiAgentMock).not.toHaveBeenCalled();
    });
  });
  it("rejects /restart when explicitly disabled", async () => {
    await withTempHome(async (home) => {
      const runEmbeddedPiAgentMock = getRunEmbeddedPiAgentMock();
      const cfg = { ...makeCfg(home), commands: { restart: false } } as OpenClawConfig;
      const res = await getReplyFromConfig(
        {
          Body: "/restart",
          From: "+1001",
          To: "+2000",
          CommandAuthorized: true,
        },
        {},
        cfg,
      );
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toContain("/restart is disabled");
      expect(runEmbeddedPiAgentMock).not.toHaveBeenCalled();
    });
  });
  it("reports status without invoking the agent", async () => {
    await withTempHome(async (home) => {
      const runEmbeddedPiAgentMock = getRunEmbeddedPiAgentMock();
      const res = await getReplyFromConfig(
        {
          Body: "/status",
          From: "+1002",
          To: "+2000",
          CommandAuthorized: true,
        },
        {},
        makeCfg(home),
      );
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toContain("OpenClaw");
      expect(runEmbeddedPiAgentMock).not.toHaveBeenCalled();
    });
  });
});
