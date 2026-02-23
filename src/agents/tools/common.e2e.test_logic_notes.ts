/*
 * AUTO ANNOTATION
 * File: src/agents/tools/common.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  createActionGate,
  readNumberParam,
  readReactionParams,
  readStringOrNumberParam,
} from "./common.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TestActions = {
  reactions?: boolean;
  messages?: boolean;
};

describe("createActionGate", () => {
  it("defaults to enabled when unset", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createActionGate<TestActions>(undefined);
    expect(gate("reactions")).toBe(true);
    expect(gate("messages", false)).toBe(false);
  });

  it("respects explicit false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createActionGate<TestActions>({ reactions: false });
    expect(gate("reactions")).toBe(false);
    expect(gate("messages")).toBe(true);
  });
});

describe("readStringOrNumberParam", () => {
  it("returns numeric strings for numbers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { chatId: 123 };
    expect(readStringOrNumberParam(params, "chatId")).toBe("123");
  });

  it("trims strings", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { chatId: "  abc  " };
    expect(readStringOrNumberParam(params, "chatId")).toBe("abc");
  });
});

describe("readNumberParam", () => {
  it("parses numeric strings", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { messageId: "42" };
    expect(readNumberParam(params, "messageId")).toBe(42);
  });

  it("truncates when integer is true", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { messageId: "42.9" };
    expect(readNumberParam(params, "messageId", { integer: true })).toBe(42);
  });
});

describe("required parameter validation", () => {
  it("throws when required values are missing", () => {
    expect(() => readStringOrNumberParam({}, "chatId", { required: true })).toThrow(
      /chatId required/,
    );
    expect(() => readNumberParam({}, "messageId", { required: true })).toThrow(
      /messageId required/,
    );
  });
});

describe("readReactionParams", () => {
  it("allows empty emoji for removal semantics", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { emoji: "" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = readReactionParams(params, {
      removeErrorMessage: "Emoji is required",
    });
    expect(result.isEmpty).toBe(true);
    expect(result.remove).toBe(false);
  });

  it("throws when remove true but emoji empty", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = { emoji: "", remove: true };
    expect(() =>
      readReactionParams(params, {
        removeErrorMessage: "Emoji is required",
      }),
    ).toThrow(/Emoji is required/);
  });

  it("passes through remove flag", () => {
    const params = { emoji: "✅", remove: true };
    const result = readReactionParams(params, {
      removeErrorMessage: "Emoji is required",
    });
    expect(result.remove).toBe(true);
    expect(result.emoji).toBe("✅");
  });
});
