/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/text-chunking.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { chunkTextForOutbound } from "./text-chunking.js";

describe("chunkTextForOutbound", () => {
  it("returns empty for empty input", () => {
    expect(chunkTextForOutbound("", 10)).toEqual([]);
  });

  it("splits on newline or whitespace boundaries", () => {
    expect(chunkTextForOutbound("alpha\nbeta gamma", 8)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("falls back to hard limit when no separator exists", () => {
    expect(chunkTextForOutbound("abcdefghij", 4)).toEqual(["abcd", "efgh", "ij"]);
  });
});
