/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/send.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@urbit/aura", () => ({
  scot: vi.fn(() => "mocked-ud"),
  da: {
    fromUnix: vi.fn(() => 123n),
  },
}));

describe("sendDm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses aura v3 helpers for the DM id", async () => {
    const { sendDm } = await import("./send.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aura = await import("@urbit/aura");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const scot = vi.mocked(aura.scot);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fromUnix = vi.mocked(aura.da.fromUnix);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sentAt = 1_700_000_000_000;
    vi.spyOn(Date, "now").mockReturnValue(sentAt);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const poke = vi.fn(async () => ({}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendDm({
      api: { poke },
      fromShip: "~zod",
      toShip: "~nec",
      text: "hi",
    });

    expect(fromUnix).toHaveBeenCalledWith(sentAt);
    expect(scot).toHaveBeenCalledWith("ud", 123n);
    expect(poke).toHaveBeenCalledTimes(1);
    expect(result.messageId).toBe("~zod/mocked-ud");
  });
});
