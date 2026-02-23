/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.triggers.trigger-handling.allows-elevated-off-groups-without-mention.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { beforeAll, describe, expect, it } from "vitest";
import { loadSessionStore } from "../config/sessions.js";
import {
  installTriggerHandlingE2eTestHooks,
  loadGetReplyFromConfig,
  MAIN_SESSION_KEY,
  makeWhatsAppElevatedCfg,
  requireSessionStorePath,
  runDirectElevatedToggleAndLoadStore,
  withTempHome,
} from "./reply.triggers.trigger-handling.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
beforeAll(async () => {
  getReplyFromConfig = await loadGetReplyFromConfig();
});

installTriggerHandlingE2eTestHooks();

describe("trigger handling", () => {
  it("allows elevated off in groups without mention", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = makeWhatsAppElevatedCfg(home, { requireMentionInGroups: false });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/elevated off",
          From: "whatsapp:group:123@g.us",
          To: "whatsapp:+2000",
          Provider: "whatsapp",
          SenderE164: "+1000",
          CommandAuthorized: true,
          ChatType: "group",
          WasMentioned: false,
        },
        {},
        cfg,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toContain("Elevated mode disabled.");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const store = loadSessionStore(requireSessionStorePath(cfg));
      expect(store["agent:main:whatsapp:group:123@g.us"]?.elevatedLevel).toBe("off");
    });
  });

  it("allows elevated directive in groups when mentioned", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = makeWhatsAppElevatedCfg(home, { requireMentionInGroups: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/elevated on",
          From: "whatsapp:group:123@g.us",
          To: "whatsapp:+2000",
          Provider: "whatsapp",
          SenderE164: "+1000",
          CommandAuthorized: true,
          ChatType: "group",
          WasMentioned: true,
        },
        {},
        cfg,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toContain("Elevated mode set to ask");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const storeRaw = await fs.readFile(requireSessionStorePath(cfg), "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const store = JSON.parse(storeRaw) as Record<string, { elevatedLevel?: string }>;
      expect(store["agent:main:whatsapp:group:123@g.us"]?.elevatedLevel).toBe("on");
    });
  });

  it("allows elevated directive in direct chats without mentions", async () => {
    await withTempHome(async (home) => {
      const cfg = makeWhatsAppElevatedCfg(home);
      const { text, store } = await runDirectElevatedToggleAndLoadStore({
        cfg,
        getReplyFromConfig,
      });
      expect(text).toContain("Elevated mode set to ask");
      expect(store[MAIN_SESSION_KEY]?.elevatedLevel).toBe("on");
    });
  });
});
