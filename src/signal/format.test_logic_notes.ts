/*
 * AUTO ANNOTATION
 * File: src/signal/format.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { markdownToSignalText } from "./format.js";

describe("markdownToSignalText", () => {
  it("renders inline styles", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = markdownToSignalText("hi _there_ **boss** ~~nope~~ `code`");

    expect(res.text).toBe("hi there boss nope code");
    expect(res.styles).toEqual([
      { start: 3, length: 5, style: "ITALIC" },
      { start: 9, length: 4, style: "BOLD" },
      { start: 14, length: 4, style: "STRIKETHROUGH" },
      { start: 19, length: 4, style: "MONOSPACE" },
    ]);
  });

  it("renders links as label plus url when needed", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = markdownToSignalText("see [docs](https://example.com) and https://example.com");

    expect(res.text).toBe("see docs (https://example.com) and https://example.com");
    expect(res.styles).toEqual([]);
  });

  it("keeps style offsets correct with multiple expanded links", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const markdown =
      "[first](https://example.com/first) **bold** [second](https://example.com/second)";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = markdownToSignalText(markdown);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const expectedText =
      "first (https://example.com/first) bold second (https://example.com/second)";

    expect(res.text).toBe(expectedText);
    expect(res.styles).toEqual([{ start: expectedText.indexOf("bold"), length: 4, style: "BOLD" }]);
  });

  it("applies spoiler styling", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = markdownToSignalText("hello ||secret|| world");

    expect(res.text).toBe("hello secret world");
    expect(res.styles).toEqual([{ start: 6, length: 6, style: "SPOILER" }]);
  });

  it("renders fenced code blocks with monospaced styles", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = markdownToSignalText("before\n\n```\nconst x = 1;\n```\n\nafter");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prefix = "before\n\n";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const code = "const x = 1;\n";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const suffix = "\nafter";

    expect(res.text).toBe(`${prefix}${code}${suffix}`);
    expect(res.styles).toEqual([{ start: prefix.length, length: code.length, style: "MONOSPACE" }]);
  });

  it("renders lists without extra block markup", () => {
    const res = markdownToSignalText("- one\n- two");

    expect(res.text).toBe("• one\n• two");
    expect(res.styles).toEqual([]);
  });

  it("uses UTF-16 code units for offsets", () => {
    const res = markdownToSignalText("😀 **bold**");

    const prefix = "😀 ";
    expect(res.text).toBe(`${prefix}bold`);
    expect(res.styles).toEqual([{ start: prefix.length, length: 4, style: "BOLD" }]);
  });
});
