/*
 * AUTO ANNOTATION
 * File: src/line/monitor.read-body.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createMockIncomingRequest } from "../../test/helpers/mock-incoming-request.js";
import { readLineWebhookRequestBody } from "./webhook-node.js";

describe("readLineWebhookRequestBody", () => {
  it("reads body within limit", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = createMockIncomingRequest(['{"events":[{"type":"message"}]}']);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = await readLineWebhookRequestBody(req, 1024);
    expect(body).toContain('"events"');
  });

  it("rejects oversized body", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = createMockIncomingRequest(["x".repeat(2048)]);
    await expect(readLineWebhookRequestBody(req, 128)).rejects.toThrow("PayloadTooLarge");
  });
});
