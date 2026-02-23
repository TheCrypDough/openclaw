/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.e2e-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";
import { expect } from "vitest";
import { subscribeEmbeddedPiSession } from "./pi-embedded-subscribe.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SubscribeEmbeddedPiSession = typeof subscribeEmbeddedPiSession;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SubscribeEmbeddedPiSessionParams = Parameters<SubscribeEmbeddedPiSession>[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PiSession = Parameters<SubscribeEmbeddedPiSession>[0]["session"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OnBlockReply = NonNullable<SubscribeEmbeddedPiSessionParams["onBlockReply"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BlockReplyChunking = NonNullable<SubscribeEmbeddedPiSessionParams["blockReplyChunking"]>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const THINKING_TAG_CASES = [
  { tag: "think", open: "<think>", close: "</think>" },
  { tag: "thinking", open: "<thinking>", close: "</thinking>" },
  { tag: "thought", open: "<thought>", close: "</thought>" },
  { tag: "antthinking", open: "<antthinking>", close: "</antthinking>" },
] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createStubSessionHarness(): {
  session: PiSession;
  emit: (evt: unknown) => void;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let handler: ((evt: unknown) => void) | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const session = {
    subscribe: (fn: (evt: unknown) => void) => {
      handler = fn;
      return () => {};
    },
  } as unknown as PiSession;

  return { session, emit: (evt: unknown) => handler?.(evt) };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSubscribedSessionHarness(
  params: Omit<Parameters<SubscribeEmbeddedPiSession>[0], "session"> & {
    sessionExtras?: Partial<PiSession>;
  },
): {
  emit: (evt: unknown) => void;
  session: PiSession;
  subscription: ReturnType<SubscribeEmbeddedPiSession>;
} {
  const { sessionExtras, ...subscribeParams } = params;
  const { session, emit } = createStubSessionHarness();
  const mergedSession = Object.assign(session, sessionExtras ?? {});
  const subscription = subscribeEmbeddedPiSession({
    ...subscribeParams,
    session: mergedSession,
  });
  return { emit, session: mergedSession, subscription };
}

export function createParagraphChunkedBlockReplyHarness(params: {
  chunking: { minChars: number; maxChars: number };
  onBlockReply?: OnBlockReply;
  runId?: string;
}): {
  emit: (evt: unknown) => void;
  onBlockReply: OnBlockReply;
  subscription: ReturnType<SubscribeEmbeddedPiSession>;
} {
  const onBlockReply: OnBlockReply = params.onBlockReply ?? (() => {});
  const { emit, subscription } = createSubscribedSessionHarness({
    runId: params.runId ?? "run",
    onBlockReply,
    blockReplyBreak: "message_end",
    blockReplyChunking: {
      ...params.chunking,
      breakPreference: "paragraph",
    },
  });
  return { emit, onBlockReply, subscription };
}

export function createTextEndBlockReplyHarness(params?: {
  onBlockReply?: OnBlockReply;
  runId?: string;
  blockReplyChunking?: BlockReplyChunking;
}): {
  emit: (evt: unknown) => void;
  onBlockReply: OnBlockReply;
  subscription: ReturnType<SubscribeEmbeddedPiSession>;
} {
  const onBlockReply: OnBlockReply = params?.onBlockReply ?? (() => {});
  const { emit, subscription } = createSubscribedSessionHarness({
    runId: params?.runId ?? "run",
    onBlockReply,
    blockReplyBreak: "text_end",
    blockReplyChunking: params?.blockReplyChunking,
  });
  return { emit, onBlockReply, subscription };
}

export function extractAgentEventPayloads(calls: Array<unknown[]>): Array<Record<string, unknown>> {
  return calls
    .map((call) => {
      const first = call?.[0] as { data?: unknown } | undefined;
      const data = first?.data;
      return data && typeof data === "object" ? (data as Record<string, unknown>) : undefined;
    })
    .filter((value): value is Record<string, unknown> => Boolean(value));
}

export function extractTextPayloads(calls: Array<unknown[]>): string[] {
  return calls
    .map((call) => {
      const payload = call?.[0] as { text?: unknown } | undefined;
      return typeof payload?.text === "string" ? payload.text : undefined;
    })
    .filter((text): text is string => Boolean(text));
}

export function emitMessageStartAndEndForAssistantText(params: {
  emit: (evt: unknown) => void;
  text: string;
}): void {
  const assistantMessage = {
    role: "assistant",
    content: [{ type: "text", text: params.text }],
  } as AssistantMessage;
  params.emit({ type: "message_start", message: assistantMessage });
  params.emit({ type: "message_end", message: assistantMessage });
}

export function emitAssistantTextDeltaAndEnd(params: {
  emit: (evt: unknown) => void;
  text: string;
}): void {
  params.emit({
    type: "message_update",
    message: { role: "assistant" },
    assistantMessageEvent: {
      type: "text_delta",
      delta: params.text,
    },
  });
  const assistantMessage = {
    role: "assistant",
    content: [{ type: "text", text: params.text }],
  } as AssistantMessage;
  params.emit({ type: "message_end", message: assistantMessage });
}

export function emitAssistantTextDelta(params: {
  emit: (evt: unknown) => void;
  delta: string;
}): void {
  params.emit({
    type: "message_update",
    message: { role: "assistant" },
    assistantMessageEvent: { type: "text_delta", delta: params.delta },
  });
}

export function emitAssistantTextEnd(params: {
  emit: (evt: unknown) => void;
  content?: string;
}): void {
  params.emit({
    type: "message_update",
    message: { role: "assistant" },
    assistantMessageEvent:
      typeof params.content === "string"
        ? { type: "text_end", content: params.content }
        : { type: "text_end" },
  });
}

export function expectFencedChunks(calls: Array<unknown[]>, expectedPrefix: string): void {
  expect(calls.length).toBeGreaterThan(1);
  for (const call of calls) {
    const chunk = (call[0] as { text?: unknown } | undefined)?.text;
    expect(typeof chunk === "string" && chunk.startsWith(expectedPrefix)).toBe(true);
    const fenceCount = typeof chunk === "string" ? (chunk.match(/```/g)?.length ?? 0) : 0;
    expect(fenceCount).toBeGreaterThanOrEqual(2);
  }
}

export function expectSingleAgentEventText(calls: Array<unknown[]>, text: string): void {
  const payloads = extractAgentEventPayloads(calls);
  expect(payloads).toHaveLength(1);
  expect(payloads[0]?.text).toBe(text);
  expect(payloads[0]?.delta).toBe(text);
}
