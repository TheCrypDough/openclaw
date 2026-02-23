/*
 * AUTO ANNOTATION
 * File: src/tui/tui-stream-assembler.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { TuiStreamAssembler } from "./tui-stream-assembler.js";

describe("TuiStreamAssembler", () => {
  it("keeps thinking before content even when thinking arrives later", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assembler = new TuiStreamAssembler();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = assembler.ingestDelta(
      "run-1",
      {
        role: "assistant",
        content: [{ type: "text", text: "Hello" }],
      },
      true,
    );
    expect(first).toBe("Hello");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = assembler.ingestDelta(
      "run-1",
      {
        role: "assistant",
        content: [{ type: "thinking", thinking: "Brain" }],
      },
      true,
    );
    expect(second).toBe("[thinking]\nBrain\n\nHello");
  });

  it("omits thinking when showThinking is false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assembler = new TuiStreamAssembler();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = assembler.ingestDelta(
      "run-2",
      {
        role: "assistant",
        content: [
          { type: "thinking", thinking: "Hidden" },
          { type: "text", text: "Visible" },
        ],
      },
      false,
    );

    expect(text).toBe("Visible");
  });

  it("falls back to streamed text on empty final payload", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-3",
      {
        role: "assistant",
        content: [{ type: "text", text: "Streamed" }],
      },
      false,
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finalText = assembler.finalize(
      "run-3",
      {
        role: "assistant",
        content: [],
      },
      false,
    );

    expect(finalText).toBe("Streamed");
  });

  it("returns null when delta text is unchanged", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const assembler = new TuiStreamAssembler();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = assembler.ingestDelta(
      "run-4",
      {
        role: "assistant",
        content: [{ type: "text", text: "Repeat" }],
      },
      false,
    );

    expect(first).toBe("Repeat");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = assembler.ingestDelta(
      "run-4",
      {
        role: "assistant",
        content: [{ type: "text", text: "Repeat" }],
      },
      false,
    );

    expect(second).toBeNull();
  });

  it("keeps richer streamed text when final payload drops earlier blocks", () => {
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-5",
      {
        role: "assistant",
        content: [
          { type: "text", text: "Before tool call" },
          { type: "tool_use", name: "search" },
          { type: "text", text: "After tool call" },
        ],
      },
      false,
    );

    const finalText = assembler.finalize(
      "run-5",
      {
        role: "assistant",
        content: [
          { type: "tool_use", name: "search" },
          { type: "text", text: "After tool call" },
        ],
      },
      false,
    );

    expect(finalText).toBe("Before tool call\nAfter tool call");
  });

  it("does not regress streamed text when a delta drops boundary blocks after tool calls", () => {
    const assembler = new TuiStreamAssembler();
    const first = assembler.ingestDelta(
      "run-5-stream",
      {
        role: "assistant",
        content: [
          { type: "text", text: "Before tool call" },
          { type: "tool_use", name: "search" },
          { type: "text", text: "After tool call" },
        ],
      },
      false,
    );
    expect(first).toBe("Before tool call\nAfter tool call");

    const second = assembler.ingestDelta(
      "run-5-stream",
      {
        role: "assistant",
        content: [
          { type: "tool_use", name: "search" },
          { type: "text", text: "After tool call" },
        ],
      },
      false,
    );

    expect(second).toBeNull();
  });

  it("keeps non-empty final text for plain text prefix/suffix updates", () => {
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-5b",
      {
        role: "assistant",
        content: [
          { type: "text", text: "Draft line 1" },
          { type: "text", text: "Draft line 2" },
        ],
      },
      false,
    );

    const finalText = assembler.finalize(
      "run-5b",
      {
        role: "assistant",
        content: [{ type: "text", text: "Draft line 1" }],
      },
      false,
    );

    expect(finalText).toBe("Draft line 1");
  });

  it("accepts richer final payload when it extends streamed text", () => {
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-6",
      {
        role: "assistant",
        content: [{ type: "text", text: "Before tool call" }],
      },
      false,
    );

    const finalText = assembler.finalize(
      "run-6",
      {
        role: "assistant",
        content: [
          { type: "text", text: "Before tool call" },
          { type: "text", text: "After tool call" },
        ],
      },
      false,
    );

    expect(finalText).toBe("Before tool call\nAfter tool call");
  });

  it("prefers non-empty final payload when it is not a dropped block regression", () => {
    const assembler = new TuiStreamAssembler();
    assembler.ingestDelta(
      "run-7",
      {
        role: "assistant",
        content: [{ type: "text", text: "NOT OK" }],
      },
      false,
    );

    const finalText = assembler.finalize(
      "run-7",
      {
        role: "assistant",
        content: [{ type: "text", text: "OK" }],
      },
      false,
    );

    expect(finalText).toBe("OK");
  });
});
