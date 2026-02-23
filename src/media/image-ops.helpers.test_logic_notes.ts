/*
 * AUTO ANNOTATION
 * File: src/media/image-ops.helpers.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { buildImageResizeSideGrid, IMAGE_REDUCE_QUALITY_STEPS } from "./image-ops.js";

describe("buildImageResizeSideGrid", () => {
  it("returns descending unique sides capped by maxSide", () => {
    expect(buildImageResizeSideGrid(1200, 900)).toEqual([1200, 1000, 900, 800]);
  });

  it("keeps only positive side values", () => {
    expect(buildImageResizeSideGrid(0, 0)).toEqual([]);
  });
});

describe("IMAGE_REDUCE_QUALITY_STEPS", () => {
  it("keeps expected quality ladder", () => {
    expect([...IMAGE_REDUCE_QUALITY_STEPS]).toEqual([85, 75, 65, 55, 45, 35]);
  });
});
