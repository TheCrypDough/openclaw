/*
 * AUTO ANNOTATION
 * File: src/slack/actions.blocks.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createSlackEditTestClient, installSlackBlockTestMocks } from "./blocks.test-helpers.js";

installSlackBlockTestMocks();
const { editSlackMessage } = await import("./actions.js");

describe("editSlackMessage blocks", () => {
  it("updates with valid blocks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await editSlackMessage("C123", "171234.567", "", {
      token: "xoxb-test",
      client,
      blocks: [{ type: "divider" }],
    });

    expect(client.chat.update).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "C123",
        ts: "171234.567",
        text: "Shared a Block Kit message",
        blocks: [{ type: "divider" }],
      }),
    );
  });

  it("uses image block text as edit fallback", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await editSlackMessage("C123", "171234.567", "", {
      token: "xoxb-test",
      client,
      blocks: [{ type: "image", image_url: "https://example.com/a.png", alt_text: "Chart" }],
    });

    expect(client.chat.update).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Chart",
      }),
    );
  });

  it("uses video block title as edit fallback", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await editSlackMessage("C123", "171234.567", "", {
      token: "xoxb-test",
      client,
      blocks: [
        {
          type: "video",
          title: { type: "plain_text", text: "Walkthrough" },
          video_url: "https://example.com/demo.mp4",
          thumbnail_url: "https://example.com/thumb.jpg",
          alt_text: "demo",
        },
      ],
    });

    expect(client.chat.update).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Walkthrough",
      }),
    );
  });

  it("uses generic file fallback text for file blocks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await editSlackMessage("C123", "171234.567", "", {
      token: "xoxb-test",
      client,
      blocks: [{ type: "file", source: "remote", external_id: "F123" }],
    });

    expect(client.chat.update).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Shared a file",
      }),
    );
  });

  it("rejects empty blocks arrays", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await expect(
      editSlackMessage("C123", "171234.567", "updated", {
        token: "xoxb-test",
        client,
        blocks: [],
      }),
    ).rejects.toThrow(/must contain at least one block/i);

    expect(client.chat.update).not.toHaveBeenCalled();
  });

  it("rejects blocks missing a type", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();

    await expect(
      editSlackMessage("C123", "171234.567", "updated", {
        token: "xoxb-test",
        client,
        blocks: [{} as { type: string }],
      }),
    ).rejects.toThrow(/non-empty string type/i);

    expect(client.chat.update).not.toHaveBeenCalled();
  });

  it("rejects blocks arrays above Slack max count", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = createSlackEditTestClient();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const blocks = Array.from({ length: 51 }, () => ({ type: "divider" }));

    await expect(
      editSlackMessage("C123", "171234.567", "updated", {
        token: "xoxb-test",
        client,
        blocks,
      }),
    ).rejects.toThrow(/cannot exceed 50 items/i);

    expect(client.chat.update).not.toHaveBeenCalled();
  });
});
