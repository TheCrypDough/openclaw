/*
 * AUTO ANNOTATION
 * File: src/agents/content-blocks.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { collectTextContentBlocks } from "./content-blocks.js";

describe("collectTextContentBlocks", () => {
  it("collects text content blocks in order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const blocks = [
      { type: "text", text: "first" },
      { type: "image", data: "abc" },
      { type: "text", text: "second" },
    ];

    expect(collectTextContentBlocks(blocks)).toEqual(["first", "second"]);
  });

  it("ignores invalid entries and non-arrays", () => {
    expect(collectTextContentBlocks(null)).toEqual([]);
    expect(collectTextContentBlocks([{ type: "text", text: 1 }, undefined, "x"])).toEqual([]);
  });
});
