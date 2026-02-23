/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/monitor/processed-messages.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createProcessedMessageTracker } from "./processed-messages.js";

describe("createProcessedMessageTracker", () => {
  it("dedupes and evicts oldest entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tracker = createProcessedMessageTracker(3);

    expect(tracker.mark("a")).toBe(true);
    expect(tracker.mark("a")).toBe(false);
    expect(tracker.has("a")).toBe(true);

    tracker.mark("b");
    tracker.mark("c");
    expect(tracker.size()).toBe(3);

    tracker.mark("d");
    expect(tracker.size()).toBe(3);
    expect(tracker.has("a")).toBe(false);
    expect(tracker.has("b")).toBe(true);
    expect(tracker.has("c")).toBe(true);
    expect(tracker.has("d")).toBe(true);
  });
});
