/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/poll-types.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { parsePollStartContent } from "./poll-types.js";

describe("parsePollStartContent", () => {
  it("parses legacy m.poll payloads", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const summary = parsePollStartContent({
      "m.poll": {
        question: { "m.text": "Lunch?" },
        kind: "m.poll.disclosed",
        max_selections: 1,
        answers: [
          { id: "answer1", "m.text": "Yes" },
          { id: "answer2", "m.text": "No" },
        ],
      },
    });

    expect(summary?.question).toBe("Lunch?");
    expect(summary?.answers).toEqual(["Yes", "No"]);
  });
});
