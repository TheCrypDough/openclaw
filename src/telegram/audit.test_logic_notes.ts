/*
 * AUTO ANNOTATION
 * File: src/telegram/audit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let collectTelegramUnmentionedGroupIds: typeof import("./audit.js").collectTelegramUnmentionedGroupIds;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let auditTelegramGroupMembership: typeof import("./audit.js").auditTelegramGroupMembership;

describe("telegram audit", () => {
  beforeAll(async () => {
    ({ collectTelegramUnmentionedGroupIds, auditTelegramGroupMembership } =
      await import("./audit.js"));
  });

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("collects unmentioned numeric group ids and flags wildcard", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = collectTelegramUnmentionedGroupIds({
      "*": { requireMention: false },
      "-1001": { requireMention: false },
      "@group": { requireMention: false },
      "-1002": { requireMention: true },
      "-1003": { requireMention: false, enabled: false },
    });
    expect(res.hasWildcardUnmentionedGroups).toBe(true);
    expect(res.groupIds).toEqual(["-1001"]);
    expect(res.unresolvedGroups).toBe(1);
  });

  it("audits membership via getChatMember", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, result: { status: "member" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await auditTelegramGroupMembership({
      token: "t",
      botId: 123,
      groupIds: ["-1001"],
      timeoutMs: 5000,
    });
    expect(res.ok).toBe(true);
    expect(res.groups[0]?.chatId).toBe("-1001");
    expect(res.groups[0]?.status).toBe("member");
  });

  it("reports bot not in group when status is left", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, result: { status: "left" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await auditTelegramGroupMembership({
      token: "t",
      botId: 123,
      groupIds: ["-1001"],
      timeoutMs: 5000,
    });
    expect(res.ok).toBe(false);
    expect(res.groups[0]?.ok).toBe(false);
    expect(res.groups[0]?.status).toBe("left");
  });
});
