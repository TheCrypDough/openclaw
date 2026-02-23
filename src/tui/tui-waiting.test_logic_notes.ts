/*
 * AUTO ANNOTATION
 * File: src/tui/tui-waiting.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { buildWaitingStatusMessage, pickWaitingPhrase } from "./tui-waiting.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const theme = {
  dim: (s: string) => `<d>${s}</d>`,
  bold: (s: string) => `<b>${s}</b>`,
  accentSoft: (s: string) => `<a>${s}</a>`,
  // oxlint-disable-next-line typescript/no-explicit-any
} as any;

describe("tui-waiting", () => {
  it("pickWaitingPhrase rotates every 10 ticks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const phrases = ["a", "b", "c"];
    expect(pickWaitingPhrase(0, phrases)).toBe("a");
    expect(pickWaitingPhrase(9, phrases)).toBe("a");
    expect(pickWaitingPhrase(10, phrases)).toBe("b");
    expect(pickWaitingPhrase(20, phrases)).toBe("c");
    expect(pickWaitingPhrase(30, phrases)).toBe("a");
  });

  it("buildWaitingStatusMessage includes shimmer markup and metadata", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const msg = buildWaitingStatusMessage({
      theme,
      tick: 1,
      elapsed: "3s",
      connectionStatus: "connected",
      phrases: ["hello"],
    });

    expect(msg).toContain("connected");
    expect(msg).toContain("3s");
    // text is wrapped per-char; check it appears in order
    expect(msg).toContain("h");
    expect(msg).toContain("e");
    expect(msg).toContain("l");
    expect(msg).toContain("o");
    // shimmer should contain both highlighted and dim parts
    expect(msg).toContain("<b><a>");
    expect(msg).toContain("<d>");
  });
});
