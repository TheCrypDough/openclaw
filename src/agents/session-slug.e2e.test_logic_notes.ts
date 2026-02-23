/*
 * AUTO ANNOTATION
 * File: src/agents/session-slug.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createSessionSlug } from "./session-slug.js";

describe("session slug", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a two-word slug by default", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const slug = createSessionSlug();
    expect(slug).toBe("amber-atlas");
  });

  it("adds a numeric suffix when the base slug is taken", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const slug = createSessionSlug((id) => id === "amber-atlas");
    expect(slug).toBe("amber-atlas-2");
  });

  it("falls back to three words when collisions persist", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const slug = createSessionSlug((id) => /^amber-atlas(-\d+)?$/.test(id));
    expect(slug).toBe("amber-atlas-atlas");
  });
});
