/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.directive.directive-behavior.shows-current-elevated-level-as-off-after.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import "./reply.directive.directive-behavior.e2e-mocks.js";
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { loadSessionStore } from "../config/sessions.js";
import {
  AUTHORIZED_WHATSAPP_COMMAND,
  installDirectiveBehaviorE2EHooks,
  makeElevatedDirectiveConfig,
  replyText,
  makeRestrictedElevatedDisabledConfig,
  runEmbeddedPiAgent,
  sessionStorePath,
  withTempHome,
} from "./reply.directive.directive-behavior.e2e-harness.js";
import { getReplyFromConfig } from "./reply.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function runAuthorizedCommand(home: string, body: string) {
  return getReplyFromConfig(
    {
      ...AUTHORIZED_WHATSAPP_COMMAND,
      Body: body,
    },
    {},
    makeElevatedDirectiveConfig(home),
  );
}

describe("directive behavior", () => {
  installDirectiveBehaviorE2EHooks();

  it("shows current elevated level as off after toggling it off", async () => {
    await withTempHome(async (home) => {
      await runAuthorizedCommand(home, "/elevated off");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await runAuthorizedCommand(home, "/elevated");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = replyText(res);
      expect(text).toContain("Current elevated level: off");
      expect(runEmbeddedPiAgent).not.toHaveBeenCalled();
    });
  });
  it("can toggle elevated off then back on (status reflects on)", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const storePath = sessionStorePath(home);
      await runAuthorizedCommand(home, "/elevated off");
      await runAuthorizedCommand(home, "/elevated on");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await runAuthorizedCommand(home, "/status");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = replyText(res);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const optionsLine = text?.split("\n").find((line) => line.trim().startsWith("⚙️"));
      expect(optionsLine).toBeTruthy();
      expect(optionsLine).toContain("elevated");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const store = loadSessionStore(storePath);
      expect(store["agent:main:main"]?.elevatedLevel).toBe("on");
      expect(runEmbeddedPiAgent).not.toHaveBeenCalled();
    });
  });
  it("rejects per-agent elevated when disabled", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/elevated on",
          From: "+1222",
          To: "+1222",
          Provider: "whatsapp",
          SenderE164: "+1222",
          SessionKey: "agent:restricted:main",
          CommandAuthorized: true,
        },
        {},
        makeRestrictedElevatedDisabledConfig(home) as unknown as OpenClawConfig,
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = replyText(res);
      expect(text).toContain("agents.list[].tools.elevated.enabled");
      expect(runEmbeddedPiAgent).not.toHaveBeenCalled();
    });
  });
});
