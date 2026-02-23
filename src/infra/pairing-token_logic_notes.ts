/*
 * AUTO ANNOTATION
 * File: src/infra/pairing-token.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { randomBytes } from "node:crypto";
import { safeEqualSecret } from "../security/secret-equal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PAIRING_TOKEN_BYTES = 32;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function generatePairingToken(): string {
  return randomBytes(PAIRING_TOKEN_BYTES).toString("base64url");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function verifyPairingToken(provided: string, expected: string): boolean {
  return safeEqualSecret(provided, expected);
}
