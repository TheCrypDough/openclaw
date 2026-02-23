/*
 * AUTO ANNOTATION
 * File: src/config/merge-patch.proto-pollution.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, it, expect } from "vitest";
import { applyMergePatch } from "./merge-patch.js";

describe("applyMergePatch prototype pollution guard", () => {
  it("ignores __proto__ keys in patch", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = { a: 1 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const patch = JSON.parse('{"__proto__": {"polluted": true}, "b": 2}');
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyMergePatch(base, patch) as Record<string, unknown>;
    expect(result.b).toBe(2);
    expect(result.a).toBe(1);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(false);
    expect(result.polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("ignores constructor key in patch", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = { a: 1 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const patch = { constructor: { polluted: true }, b: 2 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyMergePatch(base, patch) as Record<string, unknown>;
    expect(result.b).toBe(2);
    expect(Object.prototype.hasOwnProperty.call(result, "constructor")).toBe(false);
  });

  it("ignores prototype key in patch", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = { a: 1 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const patch = { prototype: { polluted: true }, b: 2 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyMergePatch(base, patch) as Record<string, unknown>;
    expect(result.b).toBe(2);
    expect(Object.prototype.hasOwnProperty.call(result, "prototype")).toBe(false);
  });

  it("ignores __proto__ in nested patches", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = { nested: { x: 1 } };
    const patch = JSON.parse('{"nested": {"__proto__": {"polluted": true}, "y": 2}}');
    const result = applyMergePatch(base, patch) as { nested: Record<string, unknown> };
    expect(result.nested.y).toBe(2);
    expect(result.nested.x).toBe(1);
    expect(Object.prototype.hasOwnProperty.call(result.nested, "__proto__")).toBe(false);
    expect(result.nested.polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
