/*
 * AUTO ANNOTATION
 * File: src/auto-reply/media-note.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { buildInboundMediaNote } from "./media-note.js";
import { createSuccessfulImageMediaDecision } from "./media-understanding.test-fixtures.js";

describe("buildInboundMediaNote", () => {
  it("formats single MediaPath as a media note", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPath: "/tmp/a.png",
      MediaType: "image/png",
      MediaUrl: "/tmp/a.png",
    });
    expect(note).toBe("[media attached: /tmp/a.png (image/png) | /tmp/a.png]");
  });

  it("formats multiple MediaPaths as numbered media notes", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"],
      MediaUrls: ["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"],
    });
    expect(note).toBe(
      [
        "[media attached: 3 files]",
        "[media attached 1/3: /tmp/a.png | /tmp/a.png]",
        "[media attached 2/3: /tmp/b.png | /tmp/b.png]",
        "[media attached 3/3: /tmp/c.png | /tmp/c.png]",
      ].join("\n"),
    );
  });

  it("skips media notes for attachments with understanding output", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
      MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
      MediaUnderstanding: [
        {
          kind: "audio.transcription",
          attachmentIndex: 0,
          text: "hello",
          provider: "groq",
        },
      ],
    });
    expect(note).toBe("[media attached: /tmp/b.png | https://example.com/b.png]");
  });

  it("only suppresses attachments when media understanding succeeded", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
      MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
      MediaUnderstandingDecisions: [
        {
          capability: "image",
          outcome: "skipped",
          attachments: [
            {
              attachmentIndex: 0,
              attempts: [
                {
                  type: "provider",
                  outcome: "skipped",
                  reason: "maxBytes: too large",
                },
              ],
            },
          ],
        },
      ],
    });
    expect(note).toBe(
      [
        "[media attached: 2 files]",
        "[media attached 1/2: /tmp/a.png | https://example.com/a.png]",
        "[media attached 2/2: /tmp/b.png | https://example.com/b.png]",
      ].join("\n"),
    );
  });

  it("suppresses attachments when media understanding succeeds via decisions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/a.png", "/tmp/b.png"],
      MediaUrls: ["https://example.com/a.png", "https://example.com/b.png"],
      MediaUnderstandingDecisions: [
        createSuccessfulImageMediaDecision() as unknown as NonNullable<
          Parameters<typeof buildInboundMediaNote>[0]["MediaUnderstandingDecisions"]
        >[number],
      ],
    });
    expect(note).toBe("[media attached: /tmp/b.png | https://example.com/b.png]");
  });

  it("strips audio attachments when transcription succeeded via MediaUnderstanding (issue #4197)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice.ogg", "/tmp/image.png"],
      MediaUrls: ["https://example.com/voice.ogg", "https://example.com/image.png"],
      MediaTypes: ["audio/ogg", "image/png"],
      MediaUnderstanding: [
        {
          kind: "audio.transcription",
          attachmentIndex: 0,
          text: "Hello world",
          provider: "whisper",
        },
      ],
    });
    // Audio attachment should be stripped (already transcribed), image should remain
    expect(note).toBe(
      "[media attached: /tmp/image.png (image/png) | https://example.com/image.png]",
    );
  });

  it("only strips audio attachments that were transcribed", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice-1.ogg", "/tmp/voice-2.ogg"],
      MediaUrls: ["https://example.com/voice-1.ogg", "https://example.com/voice-2.ogg"],
      MediaTypes: ["audio/ogg", "audio/ogg"],
      MediaUnderstanding: [
        {
          kind: "audio.transcription",
          attachmentIndex: 0,
          text: "First transcript",
          provider: "whisper",
        },
      ],
    });
    expect(note).toBe(
      "[media attached: /tmp/voice-2.ogg (audio/ogg) | https://example.com/voice-2.ogg]",
    );
  });

  it("strips audio attachments when Transcript is present (issue #4197)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice.opus"],
      MediaTypes: ["audio/opus"],
      Transcript: "Hello world from Whisper",
    });
    // Audio should be stripped when transcript is available
    expect(note).toBeUndefined();
  });

  it("does not strip multiple audio attachments using transcript-only fallback", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice-1.ogg", "/tmp/voice-2.ogg"],
      MediaTypes: ["audio/ogg", "audio/ogg"],
      Transcript: "Transcript text without per-attachment mapping",
    });
    expect(note).toBe(
      [
        "[media attached: 2 files]",
        "[media attached 1/2: /tmp/voice-1.ogg (audio/ogg)]",
        "[media attached 2/2: /tmp/voice-2.ogg (audio/ogg)]",
      ].join("\n"),
    );
  });

  it("strips audio by extension even without mime type (issue #4197)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice_message.ogg", "/tmp/document.pdf"],
      MediaUnderstanding: [
        {
          kind: "audio.transcription",
          attachmentIndex: 0,
          text: "Transcribed audio content",
          provider: "whisper",
        },
      ],
    });
    // Only PDF should remain, audio stripped by extension
    expect(note).toBe("[media attached: /tmp/document.pdf]");
  });

  it("keeps audio attachments when no transcription available", () => {
    const note = buildInboundMediaNote({
      MediaPaths: ["/tmp/voice.ogg"],
      MediaTypes: ["audio/ogg"],
    });
    // No transcription = keep audio attachment as fallback
    expect(note).toBe("[media attached: /tmp/voice.ogg (audio/ogg)]");
  });
});
