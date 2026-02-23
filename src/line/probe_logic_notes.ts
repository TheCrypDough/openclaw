/*
 * AUTO ANNOTATION
 * File: src/line/probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { messagingApi } from "@line/bot-sdk";
import { withTimeout } from "../utils/with-timeout.js";
import type { LineProbeResult } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeLineBot(
  channelAccessToken: string,
  timeoutMs = 5000,
): Promise<LineProbeResult> {
  if (!channelAccessToken?.trim()) {
    return { ok: false, error: "Channel access token not configured" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: channelAccessToken.trim(),
  });

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profile = await withTimeout(client.getBotInfo(), timeoutMs);

    return {
      ok: true,
      bot: {
        displayName: profile.displayName,
        userId: profile.userId,
        basicId: profile.basicId,
        pictureUrl: profile.pictureUrl,
      },
    };
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
