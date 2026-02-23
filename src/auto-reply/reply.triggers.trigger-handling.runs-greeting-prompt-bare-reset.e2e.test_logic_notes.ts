/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.triggers.trigger-handling.runs-greeting-prompt-bare-reset.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  getRunEmbeddedPiAgentMock,
  installTriggerHandlingE2eTestHooks,
  runGreetingPromptForBareNewOrReset,
  withTempHome,
} from "./reply.triggers.trigger-handling.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
beforeAll(async () => {
  ({ getReplyFromConfig } = await import("./reply.js"));
});

installTriggerHandlingE2eTestHooks();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectResetBlockedForNonOwner(params: {
  home: string;
  commandAuthorized: boolean;
  getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
}): Promise<void> {
  const { home, commandAuthorized, getReplyFromConfig } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await getReplyFromConfig(
    {
      Body: "/reset",
      From: "+1003",
      To: "+2000",
      CommandAuthorized: commandAuthorized,
    },
    {},
    {
      agents: {
        defaults: {
          model: { primary: "anthropic/claude-opus-4-5" },
          workspace: join(home, "openclaw"),
        },
      },
      channels: {
        whatsapp: {
          allowFrom: ["+1999"],
        },
      },
      session: {
        store: join(tmpdir(), `openclaw-session-test-${Date.now()}.json`),
      },
    },
  );
  expect(res).toBeUndefined();
  expect(getRunEmbeddedPiAgentMock()).not.toHaveBeenCalled();
}

describe("trigger handling", () => {
  it("runs a greeting prompt for a bare /reset", async () => {
    await withTempHome(async (home) => {
      await runGreetingPromptForBareNewOrReset({ home, body: "/reset", getReplyFromConfig });
    });
  });
  it("does not reset for unauthorized /reset", async () => {
    await withTempHome(async (home) => {
      await expectResetBlockedForNonOwner({
        home,
        commandAuthorized: false,
        getReplyFromConfig,
      });
    });
  });
  it("blocks /reset for non-owner senders", async () => {
    await withTempHome(async (home) => {
      await expectResetBlockedForNonOwner({
        home,
        commandAuthorized: true,
        getReplyFromConfig,
      });
    });
  });
});
