/*
 * AUTO ANNOTATION
 * File: src/line/signature.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function validateLineSignature(
  body: string,
  signature: string,
  channelSecret: string,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hash = crypto.createHmac("SHA256", channelSecret).update(body).digest("base64");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hashBuffer = Buffer.from(hash);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const signatureBuffer = Buffer.from(signature);

  // Use constant-time comparison to prevent timing attacks.
  if (hashBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, signatureBuffer);
}
