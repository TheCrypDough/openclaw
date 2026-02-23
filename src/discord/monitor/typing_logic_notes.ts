/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/typing.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Client } from "@buape/carbon";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendTyping(params: { client: Client; channelId: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channel = await params.client.fetchChannel(params.channelId);
  if (!channel) {
    return;
  }
  if ("triggerTyping" in channel && typeof channel.triggerTyping === "function") {
    await channel.triggerTyping();
  }
}
