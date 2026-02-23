/*
 * AUTO ANNOTATION
 * File: test/helpers/inbound-contract.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { expect } from "vitest";
import type { MsgContext } from "../../src/auto-reply/templating.js";
import { normalizeChatType } from "../../src/channels/chat-type.js";
import { resolveConversationLabel } from "../../src/channels/conversation-label.js";
import { validateSenderIdentity } from "../../src/channels/sender-identity.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function expectInboundContextContract(ctx: MsgContext) {
  expect(validateSenderIdentity(ctx)).toEqual([]);

  expect(ctx.Body).toBeTypeOf("string");
  expect(ctx.BodyForAgent).toBeTypeOf("string");
  expect(ctx.BodyForCommands).toBeTypeOf("string");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatType = normalizeChatType(ctx.ChatType);
  if (chatType && chatType !== "direct") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const label = ctx.ConversationLabel?.trim() || resolveConversationLabel(ctx);
    expect(label).toBeTruthy();
  }
}
