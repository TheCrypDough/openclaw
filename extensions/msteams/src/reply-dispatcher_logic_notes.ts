/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/reply-dispatcher.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  createReplyPrefixOptions,
  createTypingCallbacks,
  logTypingFailure,
  resolveChannelMediaMaxBytes,
  type OpenClawConfig,
  type MSTeamsReplyStyle,
  type RuntimeEnv,
} from "openclaw/plugin-sdk";
import type { MSTeamsAccessTokenProvider } from "./attachments/types.js";
import type { StoredConversationReference } from "./conversation-store.js";
import {
  classifyMSTeamsSendError,
  formatMSTeamsSendErrorHint,
  formatUnknownError,
} from "./errors.js";
import {
  type MSTeamsAdapter,
  renderReplyPayloadsToMessages,
  sendMSTeamsMessages,
} from "./messenger.js";
import type { MSTeamsMonitorLogger } from "./monitor-types.js";
import { getMSTeamsRuntime } from "./runtime.js";
import type { MSTeamsTurnContext } from "./sdk-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMSTeamsReplyDispatcher(params: {
  cfg: OpenClawConfig;
  agentId: string;
  accountId?: string;
  runtime: RuntimeEnv;
  log: MSTeamsMonitorLogger;
  adapter: MSTeamsAdapter;
  appId: string;
  conversationRef: StoredConversationReference;
  context: MSTeamsTurnContext;
  replyStyle: MSTeamsReplyStyle;
  textLimit: number;
  onSentMessageIds?: (ids: string[]) => void;
  /** Token provider for OneDrive/SharePoint uploads in group chats/channels */
  tokenProvider?: MSTeamsAccessTokenProvider;
  /** SharePoint site ID for file uploads in group chats/channels */
  sharePointSiteId?: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const core = getMSTeamsRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sendTypingIndicator = async () => {
    await params.context.sendActivity({ type: "typing" });
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const typingCallbacks = createTypingCallbacks({
    start: sendTypingIndicator,
    onStartError: (err) => {
      logTypingFailure({
        log: (message) => params.log.debug?.(message),
        channel: "msteams",
        action: "start",
        error: err,
      });
    },
  });
  const { onModelSelected, ...prefixOptions } = createReplyPrefixOptions({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "msteams",
    accountId: params.accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "msteams");

  const { dispatcher, replyOptions, markDispatchIdle } =
    core.channel.reply.createReplyDispatcherWithTyping({
      ...prefixOptions,
      humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
      deliver: async (payload) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const tableMode = core.channel.text.resolveMarkdownTableMode({
          cfg: params.cfg,
          channel: "msteams",
        });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const messages = renderReplyPayloadsToMessages([payload], {
          textChunkLimit: params.textLimit,
          chunkText: true,
          mediaMode: "split",
          tableMode,
          chunkMode,
        });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const mediaMaxBytes = resolveChannelMediaMaxBytes({
          cfg: params.cfg,
          resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb,
        });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const ids = await sendMSTeamsMessages({
          replyStyle: params.replyStyle,
          adapter: params.adapter,
          appId: params.appId,
          conversationRef: params.conversationRef,
          context: params.context,
          messages,
          // Enable default retry/backoff for throttling/transient failures.
          retry: {},
          onRetry: (event) => {
            params.log.debug?.("retrying send", {
              replyStyle: params.replyStyle,
              ...event,
            });
          },
          tokenProvider: params.tokenProvider,
          sharePointSiteId: params.sharePointSiteId,
          mediaMaxBytes,
        });
        if (ids.length > 0) {
          params.onSentMessageIds?.(ids);
        }
      },
      onError: (err, info) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const errMsg = formatUnknownError(err);
        const classification = classifyMSTeamsSendError(err);
        const hint = formatMSTeamsSendErrorHint(classification);
        params.runtime.error?.(
          `msteams ${info.kind} reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`,
        );
        params.log.error("reply failed", {
          kind: info.kind,
          error: errMsg,
          classification,
          hint,
        });
      },
      onReplyStart: typingCallbacks.onReplyStart,
    });

  return {
    dispatcher,
    replyOptions: { ...replyOptions, onModelSelected },
    markDispatchIdle,
  };
}
