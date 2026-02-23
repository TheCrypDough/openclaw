/*
 * AUTO ANNOTATION
 * File: src/markdown/whatsapp.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { markdownToWhatsApp } from "./whatsapp.js";

describe("markdownToWhatsApp", () => {
  it("handles common markdown-to-whatsapp conversions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cases = [
      ["converts **bold** to *bold*", "**SOD Blast:**", "*SOD Blast:*"],
      ["converts __bold__ to *bold*", "__important__", "*important*"],
      ["converts ~~strikethrough~~ to ~strikethrough~", "~~deleted~~", "~deleted~"],
      ["leaves single *italic* unchanged (already WhatsApp bold)", "*text*", "*text*"],
      ["leaves _italic_ unchanged (already WhatsApp italic)", "_text_", "_text_"],
      ["preserves inline code", "Use `**not bold**` here", "Use `**not bold**` here"],
      [
        "handles mixed formatting",
        "**bold** and ~~strike~~ and _italic_",
        "*bold* and ~strike~ and _italic_",
      ],
      ["handles multiple bold segments", "**one** then **two**", "*one* then *two*"],
      ["returns empty string for empty input", "", ""],
      ["returns plain text unchanged", "no formatting here", "no formatting here"],
      ["handles bold inside a sentence", "This is **very** important", "This is *very* important"],
    ] as const;
    for (const [name, input, expected] of cases) {
      expect(markdownToWhatsApp(input), name).toBe(expected);
    }
  });

  it("preserves fenced code blocks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "```\nconst x = **bold**;\n```";
    expect(markdownToWhatsApp(input)).toBe(input);
  });

  it("preserves code block with formatting inside", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "Before ```**bold** and ~~strike~~``` after **real bold**";
    expect(markdownToWhatsApp(input)).toBe(
      "Before ```**bold** and ~~strike~~``` after *real bold*",
    );
  });
});
