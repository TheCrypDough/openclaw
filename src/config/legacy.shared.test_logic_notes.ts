/*
 * AUTO ANNOTATION
 * File: src/config/legacy.shared.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it } from "vitest";
import { mergeMissing } from "./legacy.shared.js";

describe("mergeMissing prototype pollution guard", () => {
  afterEach(() => {
    delete (Object.prototype as Record<string, unknown>).polluted;
  });

  it("ignores __proto__ keys without polluting Object.prototype", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const target = { safe: { keep: true } } as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const source = JSON.parse('{"safe":{"next":1},"__proto__":{"polluted":true}}') as Record<
      string,
      unknown
    >;

    mergeMissing(target, source);

    expect((target.safe as Record<string, unknown>).keep).toBe(true);
    expect((target.safe as Record<string, unknown>).next).toBe(1);
    expect(target.polluted).toBeUndefined();
    expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();
  });
});
