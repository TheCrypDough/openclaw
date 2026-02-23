/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/providers/twilio/webhook.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebhookContext, WebhookVerificationResult } from "../../types.js";
import { verifyTwilioWebhook } from "../../webhook-security.js";
import type { TwilioProviderOptions } from "../twilio.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function verifyTwilioProviderWebhook(params: {
  ctx: WebhookContext;
  authToken: string;
  currentPublicUrl?: string | null;
  options: TwilioProviderOptions;
}): WebhookVerificationResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = verifyTwilioWebhook(params.ctx, params.authToken, {
    publicUrl: params.currentPublicUrl || undefined,
    allowNgrokFreeTierLoopbackBypass: params.options.allowNgrokFreeTierLoopbackBypass ?? false,
    skipVerification: params.options.skipVerification,
    allowedHosts: params.options.webhookSecurity?.allowedHosts,
    trustForwardingHeaders: params.options.webhookSecurity?.trustForwardingHeaders,
    trustedProxyIPs: params.options.webhookSecurity?.trustedProxyIPs,
    remoteIP: params.ctx.remoteAddress,
  });

  if (!result.ok) {
    console.warn(`[twilio] Webhook verification failed: ${result.reason}`);
    if (result.verificationUrl) {
      console.warn(`[twilio] Verification URL: ${result.verificationUrl}`);
    }
  }

  return {
    ok: result.ok,
    reason: result.reason,
  };
}
