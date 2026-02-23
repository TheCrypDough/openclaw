/*
 * AUTO ANNOTATION
 * File: src/line/webhook-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebhookRequestBody } from "@line/bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseLineWebhookBody(rawBody: string): WebhookRequestBody | null {
  try {
    return JSON.parse(rawBody) as WebhookRequestBody;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isLineWebhookVerificationRequest(
  body: WebhookRequestBody | null | undefined,
): boolean {
  return !!body && Array.isArray(body.events) && body.events.length === 0;
}
