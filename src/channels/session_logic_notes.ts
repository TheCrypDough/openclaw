/*
 * AUTO ANNOTATION
 * File: src/channels/session.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../auto-reply/templating.js";
import {
  recordSessionMetaFromInbound,
  type GroupKeyResolution,
  type SessionEntry,
  updateLastRoute,
} from "../config/sessions.js";

export type InboundLastRouteUpdate = {
  sessionKey: string;
  channel: SessionEntry["lastChannel"];
  to: string;
  accountId?: string;
  threadId?: string | number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function recordInboundSession(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
}): Promise<void> {
  const { storePath, sessionKey, ctx, groupResolution, createIfMissing } = params;
  void recordSessionMetaFromInbound({
    storePath,
    sessionKey,
    ctx,
    groupResolution,
    createIfMissing,
  }).catch(params.onRecordError);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const update = params.updateLastRoute;
  if (!update) {
    return;
  }
  await updateLastRoute({
    storePath,
    sessionKey: update.sessionKey,
    deliveryContext: {
      channel: update.channel,
      to: update.to,
      accountId: update.accountId,
      threadId: update.threadId,
    },
    ctx,
    groupResolution,
  });
}
