/*
 * AUTO ANNOTATION
 * File: src/pairing/pairing-labels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getPairingAdapter } from "../channels/plugins/pairing.js";
import type { PairingChannel } from "./pairing-store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePairingIdLabel(channel: PairingChannel): string {
  return getPairingAdapter(channel)?.idLabel ?? "userId";
}
