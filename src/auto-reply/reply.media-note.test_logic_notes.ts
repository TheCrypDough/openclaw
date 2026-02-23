/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.media-note.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import "./reply.directive.directive-behavior.e2e-mocks.js";
import { describe, expect, it, vi } from "vitest";
import { withTempHome as withTempHomeBase } from "../../test/helpers/temp-home.js";
import { runEmbeddedPiAgent } from "../agents/pi-embedded.js";
import type { OpenClawConfig } from "../config/config.js";
import { getReplyFromConfig } from "./reply.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeResult(text: string) {
  return {
    payloads: [{ text }],
    meta: {
      durationMs: 5,
      agentMeta: { sessionId: "s", provider: "p", model: "m" },
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
  return withTempHomeBase(
    async (home) => {
      vi.mocked(runEmbeddedPiAgent).mockReset();
      return await fn(home);
    },
    {
      env: {
        OPENCLAW_BUNDLED_SKILLS_DIR: (home) => path.join(home, "bundled-skills"),
      },
      prefix: "openclaw-media-note-",
    },
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeCfg(home: string) {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-5",
        workspace: path.join(home, "openclaw"),
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: path.join(home, "sessions.json") },
  } as unknown as OpenClawConfig;
}

describe("getReplyFromConfig media note plumbing", () => {
  it("includes all MediaPaths in the agent prompt", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let seenPrompt: string | undefined;
      vi.mocked(runEmbeddedPiAgent).mockImplementation(async (params) => {
        seenPrompt = params.prompt;
        return makeResult("ok");
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = makeCfg(home);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "hello",
          From: "+1001",
          To: "+2000",
          MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
          MediaUrls: ["/tmp/a.png", "/tmp/b.png"],
        },
        {},
        cfg,
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toBe("ok");
      expect(seenPrompt).toBeTruthy();
      expect(seenPrompt).toContain("[media attached: 2 files]");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const idxA = seenPrompt?.indexOf("[media attached 1/2: /tmp/a.png");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const idxB = seenPrompt?.indexOf("[media attached 2/2: /tmp/b.png");
      expect(typeof idxA).toBe("number");
      expect(typeof idxB).toBe("number");
      expect((idxA ?? -1) >= 0).toBe(true);
      expect((idxB ?? -1) >= 0).toBe(true);
      expect((idxA ?? 0) < (idxB ?? 0)).toBe(true);
    });
  });
});
