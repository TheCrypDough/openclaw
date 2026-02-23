/*
 * AUTO ANNOTATION
 * File: ui/src/ui/chat/tool-helpers.test.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, it, expect } from "vitest";
import { formatToolOutputForSidebar, getTruncatedPreview } from "./tool-helpers.ts";

describe("tool-helpers", () => {
  describe("formatToolOutputForSidebar", () => {
    it("formats valid JSON object as code block", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const input = '{"name":"test","value":123}';
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = formatToolOutputForSidebar(input);

      expect(result).toBe(`\`\`\`json
{
  "name": "test",
  "value": 123
}
\`\`\``);
    });

    it("formats valid JSON array as code block", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const input = "[1, 2, 3]";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = formatToolOutputForSidebar(input);

      expect(result).toBe(`\`\`\`json
[
  1,
  2,
  3
]
\`\`\``);
    });

    it("handles nested JSON objects", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const input = '{"outer":{"inner":"value"}}';
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = formatToolOutputForSidebar(input);

      expect(result).toContain("```json");
      expect(result).toContain('"outer"');
      expect(result).toContain('"inner"');
    });

    it("returns plain text for non-JSON content", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const input = "This is plain text output";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = formatToolOutputForSidebar(input);

      expect(result).toBe("This is plain text output");
    });

    it("returns as-is for invalid JSON starting with {", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const input = "{not valid json";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = formatToolOutputForSidebar(input);

      expect(result).toBe("{not valid json");
    });

    it("returns as-is for invalid JSON starting with [", () => {
      const input = "[not valid json";
      const result = formatToolOutputForSidebar(input);

      expect(result).toBe("[not valid json");
    });

    it("trims whitespace before detecting JSON", () => {
      const input = '   {"trimmed": true}   ';
      const result = formatToolOutputForSidebar(input);

      expect(result).toContain("```json");
      expect(result).toContain('"trimmed"');
    });

    it("handles empty string", () => {
      const result = formatToolOutputForSidebar("");
      expect(result).toBe("");
    });

    it("handles whitespace-only string", () => {
      const result = formatToolOutputForSidebar("   ");
      expect(result).toBe("   ");
    });
  });

  describe("getTruncatedPreview", () => {
    it("returns short text unchanged", () => {
      const input = "Short text";
      const result = getTruncatedPreview(input);

      expect(result).toBe("Short text");
    });

    it("truncates text longer than max chars", () => {
      const input = "a".repeat(150);
      const result = getTruncatedPreview(input);

      expect(result.length).toBe(101); // 100 chars + ellipsis
      expect(result.endsWith("…")).toBe(true);
    });

    it("truncates to max lines", () => {
      const input = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
      const result = getTruncatedPreview(input);

      // Should only show first 2 lines (PREVIEW_MAX_LINES = 2)
      expect(result).toBe("Line 1\nLine 2…");
    });

    it("adds ellipsis when lines are truncated", () => {
      const input = "Line 1\nLine 2\nLine 3";
      const result = getTruncatedPreview(input);

      expect(result.endsWith("…")).toBe(true);
    });

    it("does not add ellipsis when all lines fit", () => {
      const input = "Line 1\nLine 2";
      const result = getTruncatedPreview(input);

      expect(result).toBe("Line 1\nLine 2");
      expect(result.endsWith("…")).toBe(false);
    });

    it("handles single line within limits", () => {
      const input = "Single line";
      const result = getTruncatedPreview(input);

      expect(result).toBe("Single line");
    });

    it("handles empty string", () => {
      const result = getTruncatedPreview("");
      expect(result).toBe("");
    });

    it("truncates by chars even within line limit", () => {
      // Two lines but very long content
      const longLine = "x".repeat(80);
      const input = `${longLine}\n${longLine}`;
      const result = getTruncatedPreview(input);

      expect(result.length).toBe(101); // 100 + ellipsis
      expect(result.endsWith("…")).toBe(true);
    });
  });
});
