/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/sender-identity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { User } from "@buape/carbon";
import type { PluralKitMessageInfo } from "../pluralkit.js";
import { formatDiscordUserTag } from "./format.js";

export type DiscordSenderIdentity = {
  id: string;
  name?: string;
  tag?: string;
  label: string;
  isPluralKit: boolean;
  pluralkit?: {
    memberId: string;
    memberName?: string;
    systemId?: string;
    systemName?: string;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordWebhookMessageLike = {
  webhookId?: string | null;
  webhook_id?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordWebhookId(message: DiscordWebhookMessageLike): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidate = message.webhookId ?? message.webhook_id;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordSenderIdentity(params: {
  author: User;
  // oxlint-disable-next-line typescript/no-explicit-any
  member?: any;
  pluralkitInfo?: PluralKitMessageInfo | null;
}): DiscordSenderIdentity {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pkInfo = params.pluralkitInfo ?? null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pkMember = pkInfo?.member ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pkSystem = pkInfo?.system ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memberId = pkMember?.id?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memberNameRaw = pkMember?.display_name ?? pkMember?.name ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memberName = memberNameRaw?.trim();
  if (memberId && memberName) {
    const systemName = pkSystem?.name?.trim();
    const label = systemName ? `${memberName} (PK:${systemName})` : `${memberName} (PK)`;
    return {
      id: memberId,
      name: memberName,
      tag: pkMember?.name?.trim() || undefined,
      label,
      isPluralKit: true,
      pluralkit: {
        memberId,
        memberName,
        systemId: pkSystem?.id?.trim() || undefined,
        systemName,
      },
    };
  }

  const senderTag = formatDiscordUserTag(params.author);
  const senderDisplay =
    params.member?.nickname ?? params.author.globalName ?? params.author.username;
  const senderLabel =
    senderDisplay && senderTag && senderDisplay !== senderTag
      ? `${senderDisplay} (${senderTag})`
      : (senderDisplay ?? senderTag ?? params.author.id);
  return {
    id: params.author.id,
    name: params.author.username ?? undefined,
    tag: senderTag,
    label: senderLabel,
    isPluralKit: false,
  };
}

export function resolveDiscordSenderLabel(params: {
  author: User;
  // oxlint-disable-next-line typescript/no-explicit-any
  member?: any;
  pluralkitInfo?: PluralKitMessageInfo | null;
}): string {
  return resolveDiscordSenderIdentity(params).label;
}
