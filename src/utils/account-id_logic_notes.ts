/*
 * AUTO ANNOTATION
 * File: src/utils/account-id.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeOptionalAccountId } from "../routing/account-id.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAccountId(value?: string): string | undefined {
  return normalizeOptionalAccountId(value);
}
