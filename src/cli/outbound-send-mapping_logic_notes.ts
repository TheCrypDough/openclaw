/*
 * AUTO ANNOTATION
 * File: src/cli/outbound-send-mapping.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OutboundSendDeps } from "../infra/outbound/deliver.js";

export type CliOutboundSendSource = {
  sendMessageWhatsApp: OutboundSendDeps["sendWhatsApp"];
  sendMessageTelegram: OutboundSendDeps["sendTelegram"];
  sendMessageDiscord: OutboundSendDeps["sendDiscord"];
  sendMessageSlack: OutboundSendDeps["sendSlack"];
  sendMessageSignal: OutboundSendDeps["sendSignal"];
  sendMessageIMessage: OutboundSendDeps["sendIMessage"];
};

// Provider docking: extend this mapping when adding new outbound send deps.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createOutboundSendDepsFromCliSource(deps: CliOutboundSendSource): OutboundSendDeps {
  return {
    sendWhatsApp: deps.sendMessageWhatsApp,
    sendTelegram: deps.sendMessageTelegram,
    sendDiscord: deps.sendMessageDiscord,
    sendSlack: deps.sendMessageSlack,
    sendSignal: deps.sendMessageSignal,
    sendIMessage: deps.sendMessageIMessage,
  };
}
