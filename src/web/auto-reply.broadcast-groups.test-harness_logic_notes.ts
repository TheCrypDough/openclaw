/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply.broadcast-groups.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import { monitorWebChannel } from "./auto-reply.js";
import {
  createWebInboundDeliverySpies,
  createWebListenerFactoryCapture,
  sendWebDirectInboundMessage,
} from "./auto-reply.test-harness.js";
import type { WebInboundMessage } from "./inbound.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function monitorWebChannelWithCapture(resolver: unknown): Promise<{
  spies: ReturnType<typeof createWebInboundDeliverySpies>;
  onMessage: (msg: WebInboundMessage) => Promise<void>;
}> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spies = createWebInboundDeliverySpies();
  const { listenerFactory, getOnMessage } = createWebListenerFactoryCapture();

  await monitorWebChannel(false, listenerFactory, false, resolver as never);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onMessage = getOnMessage();
  if (!onMessage) {
    throw new Error("Missing onMessage handler");
  }

  return { spies, onMessage };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendWebDirectInboundAndCollectSessionKeys(): Promise<{
  seen: string[];
  resolver: ReturnType<typeof vi.fn>;
}> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolver = vi.fn(async (ctx: { SessionKey?: unknown }) => {
    seen.push(String(ctx.SessionKey));
    return { text: "ok" };
  });

  const { spies, onMessage } = await monitorWebChannelWithCapture(resolver);
  await sendWebDirectInboundMessage({
    onMessage,
    spies,
    id: "m1",
    from: "+1000",
    to: "+2000",
    body: "hello",
  });

  return { seen, resolver };
}
