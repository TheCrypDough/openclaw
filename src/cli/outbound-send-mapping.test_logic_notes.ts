/*
 * AUTO ANNOTATION
 * File: src/cli/outbound-send-mapping.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  createOutboundSendDepsFromCliSource,
  type CliOutboundSendSource,
} from "./outbound-send-mapping.js";

describe("createOutboundSendDepsFromCliSource", () => {
  it("maps CLI send deps to outbound send deps", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps: CliOutboundSendSource = {
      sendMessageWhatsApp: vi.fn() as CliOutboundSendSource["sendMessageWhatsApp"],
      sendMessageTelegram: vi.fn() as CliOutboundSendSource["sendMessageTelegram"],
      sendMessageDiscord: vi.fn() as CliOutboundSendSource["sendMessageDiscord"],
      sendMessageSlack: vi.fn() as CliOutboundSendSource["sendMessageSlack"],
      sendMessageSignal: vi.fn() as CliOutboundSendSource["sendMessageSignal"],
      sendMessageIMessage: vi.fn() as CliOutboundSendSource["sendMessageIMessage"],
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const outbound = createOutboundSendDepsFromCliSource(deps);

    expect(outbound).toEqual({
      sendWhatsApp: deps.sendMessageWhatsApp,
      sendTelegram: deps.sendMessageTelegram,
      sendDiscord: deps.sendMessageDiscord,
      sendSlack: deps.sendMessageSlack,
      sendSignal: deps.sendMessageSignal,
      sendIMessage: deps.sendMessageIMessage,
    });
  });
});
