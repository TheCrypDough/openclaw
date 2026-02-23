/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/providers/twilio.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { WebhookContext } from "../types.js";
import { TwilioProvider } from "./twilio.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const STREAM_URL = "wss://example.ngrok.app/voice/stream";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createProvider(): TwilioProvider {
  return new TwilioProvider(
    { accountSid: "AC123", authToken: "secret" },
    { publicUrl: "https://example.ngrok.app", streamPath: "/voice/stream" },
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createContext(rawBody: string, query?: WebhookContext["query"]): WebhookContext {
  return {
    headers: {},
    rawBody,
    url: "https://example.ngrok.app/voice/twilio",
    method: "POST",
    query,
  };
}

describe("TwilioProvider", () => {
  it("returns streaming TwiML for outbound conversation calls before in-progress", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = createProvider();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = createContext("CallStatus=initiated&Direction=outbound-api&CallSid=CA123", {
      callId: "call-1",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = provider.parseWebhookEvent(ctx);

    expect(result.providerResponseBody).toContain(STREAM_URL);
    expect(result.providerResponseBody).toContain('<Parameter name="token" value="');
    expect(result.providerResponseBody).toContain("<Connect>");
  });

  it("returns empty TwiML for status callbacks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = createProvider();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = createContext("CallStatus=ringing&Direction=outbound-api", {
      callId: "call-1",
      type: "status",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = provider.parseWebhookEvent(ctx);

    expect(result.providerResponseBody).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    );
  });

  it("returns streaming TwiML for inbound calls", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const provider = createProvider();
    const ctx = createContext("CallStatus=ringing&Direction=inbound&CallSid=CA456");

    const result = provider.parseWebhookEvent(ctx);

    expect(result.providerResponseBody).toContain(STREAM_URL);
    expect(result.providerResponseBody).toContain('<Parameter name="token" value="');
    expect(result.providerResponseBody).toContain("<Connect>");
  });
});
