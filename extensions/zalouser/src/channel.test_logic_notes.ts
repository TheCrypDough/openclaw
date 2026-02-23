/*
 * AUTO ANNOTATION
 * File: extensions/zalouser/src/channel.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { zalouserPlugin } from "./channel.js";

describe("zalouser outbound chunker", () => {
  it("chunks without empty strings and respects limit", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunker = zalouserPlugin.outbound?.chunker;
    expect(chunker).toBeTypeOf("function");
    if (!chunker) {
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const limit = 10;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunks = chunker("hello world\nthis is a test", limit);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.length > 0)).toBe(true);
    expect(chunks.every((c) => c.length <= limit)).toBe(true);
  });
});
