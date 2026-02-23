/*
 * AUTO ANNOTATION
 * File: src/browser/routes/agent.shared.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { readBody, resolveTargetIdFromBody, resolveTargetIdFromQuery } from "./agent.shared.js";
import type { BrowserRequest } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function requestWithBody(body: unknown): BrowserRequest {
  return {
    params: {},
    query: {},
    body,
  };
}

describe("browser route shared helpers", () => {
  describe("readBody", () => {
    it("returns object bodies", () => {
      expect(readBody(requestWithBody({ one: 1 }))).toEqual({ one: 1 });
    });

    it("normalizes non-object bodies to empty object", () => {
      expect(readBody(requestWithBody(null))).toEqual({});
      expect(readBody(requestWithBody("text"))).toEqual({});
      expect(readBody(requestWithBody(["x"]))).toEqual({});
    });
  });

  describe("target id parsing", () => {
    it("extracts and trims targetId from body", () => {
      expect(resolveTargetIdFromBody({ targetId: "  tab-1  " })).toBe("tab-1");
      expect(resolveTargetIdFromBody({ targetId: "   " })).toBeUndefined();
      expect(resolveTargetIdFromBody({ targetId: 123 })).toBeUndefined();
    });

    it("extracts and trims targetId from query", () => {
      expect(resolveTargetIdFromQuery({ targetId: "  tab-2  " })).toBe("tab-2");
      expect(resolveTargetIdFromQuery({ targetId: "" })).toBeUndefined();
      expect(resolveTargetIdFromQuery({ targetId: false })).toBeUndefined();
    });
  });
});
