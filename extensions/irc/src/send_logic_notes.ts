/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/send.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveIrcAccount } from "./accounts.js";
import type { IrcClient } from "./client.js";
import { connectIrcClient } from "./client.js";
import { buildIrcConnectOptions } from "./connect-options.js";
import { normalizeIrcMessagingTarget } from "./normalize.js";
import { makeIrcMessageId } from "./protocol.js";
import { getIrcRuntime } from "./runtime.js";
import type { CoreConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SendIrcOptions = {
  accountId?: string;
  replyTo?: string;
  target?: string;
  client?: IrcClient;
};

export type SendIrcResult = {
  messageId: string;
  target: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTarget(to: string, opts?: SendIrcOptions): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromArg = normalizeIrcMessagingTarget(to);
  if (fromArg) {
    return fromArg;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fromOpt = normalizeIrcMessagingTarget(opts?.target ?? "");
  if (fromOpt) {
    return fromOpt;
  }
  throw new Error(`Invalid IRC target: ${to}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendMessageIrc(
  to: string,
  text: string,
  opts: SendIrcOptions = {},
): Promise<SendIrcResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime = getIrcRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = runtime.config.loadConfig() as CoreConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveIrcAccount({
    cfg,
    accountId: opts.accountId,
  });

  if (!account.configured) {
    throw new Error(
      `IRC is not configured for account "${account.accountId}" (need host and nick in channels.irc).`,
    );
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = resolveTarget(to, opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tableMode = runtime.channel.text.resolveMarkdownTableMode({
    cfg,
    channel: "irc",
    accountId: account.accountId,
  });
  const prepared = runtime.channel.text.convertMarkdownTables(text.trim(), tableMode);
  const payload = opts.replyTo ? `${prepared}\n\n[reply:${opts.replyTo}]` : prepared;

  if (!payload.trim()) {
    throw new Error("Message must be non-empty for IRC sends");
  }

  const client = opts.client;
  if (client?.isReady()) {
    client.sendPrivmsg(target, payload);
  } else {
    const transient = await connectIrcClient(
      buildIrcConnectOptions(account, {
        connectTimeoutMs: 12000,
      }),
    );
    transient.sendPrivmsg(target, payload);
    transient.quit("sent");
  }

  runtime.channel.activity.record({
    channel: "irc",
    accountId: account.accountId,
    direction: "outbound",
  });

  return {
    messageId: makeIrcMessageId(),
    target,
  };
}
