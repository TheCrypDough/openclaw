/*
 * AUTO ANNOTATION
 * File: extensions/nextcloud-talk/src/monitor.read-body.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createMockIncomingRequest } from "../../../test/helpers/mock-incoming-request.js";
import { readNextcloudTalkWebhookBody } from "./monitor.js";

describe("readNextcloudTalkWebhookBody", () => {
  it("reads valid body within max bytes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = createMockIncomingRequest(['{"type":"Create"}']);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = await readNextcloudTalkWebhookBody(req, 1024);
    expect(body).toBe('{"type":"Create"}');
  });

  it("rejects when payload exceeds max bytes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = createMockIncomingRequest(["x".repeat(300)]);
    await expect(readNextcloudTalkWebhookBody(req, 128)).rejects.toThrow("PayloadTooLarge");
  });
});
