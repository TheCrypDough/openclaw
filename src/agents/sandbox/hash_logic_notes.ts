/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox/hash.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hashTextSha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
