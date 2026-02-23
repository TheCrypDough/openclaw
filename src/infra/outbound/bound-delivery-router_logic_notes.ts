/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/bound-delivery-router.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  getSessionBindingService,
  type ConversationRef,
  type SessionBindingRecord,
  type SessionBindingService,
} from "./session-binding-service.js";

export type BoundDeliveryRouterInput = {
  eventKind: "task_completion";
  targetSessionKey: string;
  requester?: ConversationRef;
  failClosed: boolean;
};

export type BoundDeliveryRouterResult = {
  binding: SessionBindingRecord | null;
  mode: "bound" | "fallback";
  reason: string;
};

export type BoundDeliveryRouter = {
  resolveDestination: (input: BoundDeliveryRouterInput) => BoundDeliveryRouterResult;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isActiveBinding(record: SessionBindingRecord): boolean {
  return record.status === "active";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveBindingForRequester(
  requester: ConversationRef,
  bindings: SessionBindingRecord[],
): SessionBindingRecord | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchingChannelAccount = bindings.filter(
    (entry) =>
      entry.conversation.channel === requester.channel &&
      entry.conversation.accountId === requester.accountId,
  );
  if (matchingChannelAccount.length === 0) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exactConversation = matchingChannelAccount.find(
    (entry) => entry.conversation.conversationId === requester.conversationId,
  );
  if (exactConversation) {
    return exactConversation;
  }

  if (matchingChannelAccount.length === 1) {
    return matchingChannelAccount[0] ?? null;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBoundDeliveryRouter(
  service: SessionBindingService = getSessionBindingService(),
): BoundDeliveryRouter {
  return {
    resolveDestination: (input) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const targetSessionKey = input.targetSessionKey.trim();
      if (!targetSessionKey) {
        return {
          binding: null,
          mode: "fallback",
          reason: "missing-target-session",
        };
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const activeBindings = service.listBySession(targetSessionKey).filter(isActiveBinding);
      if (activeBindings.length === 0) {
        return {
          binding: null,
          mode: "fallback",
          reason: "no-active-binding",
        };
      }

      if (!input.requester) {
        if (activeBindings.length === 1) {
          return {
            binding: activeBindings[0] ?? null,
            mode: "bound",
            reason: "single-active-binding",
          };
        }
        return {
          binding: null,
          mode: "fallback",
          reason: "ambiguous-without-requester",
        };
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const requester: ConversationRef = {
        channel: input.requester.channel.trim().toLowerCase(),
        accountId: input.requester.accountId.trim(),
        conversationId: input.requester.conversationId.trim(),
        parentConversationId: input.requester.parentConversationId?.trim() || undefined,
      };
      if (!requester.channel || !requester.conversationId) {
        return {
          binding: null,
          mode: "fallback",
          reason: "invalid-requester",
        };
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const fromRequester = resolveBindingForRequester(requester, activeBindings);
      if (fromRequester) {
        return {
          binding: fromRequester,
          mode: "bound",
          reason: "requester-match",
        };
      }

      if (activeBindings.length === 1 && !input.failClosed) {
        return {
          binding: activeBindings[0] ?? null,
          mode: "bound",
          reason: "single-active-binding-fallback",
        };
      }

      return {
        binding: null,
        mode: "fallback",
        reason: "no-requester-match",
      };
    },
  };
}
