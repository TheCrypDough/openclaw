/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/outbound.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelOutboundAdapter } from "openclaw/plugin-sdk";
import { createMSTeamsPollStoreFs } from "./polls.js";
import { getMSTeamsRuntime } from "./runtime.js";
import { sendMessageMSTeams, sendPollMSTeams } from "./send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const msteamsOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  chunker: (text, limit) => getMSTeamsRuntime().channel.text.chunkMarkdownText(text, limit),
  chunkerMode: "markdown",
  textChunkLimit: 4000,
  pollMaxOptions: 12,
  sendText: async ({ cfg, to, text, deps }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send = deps?.sendMSTeams ?? ((to, text) => sendMessageMSTeams({ cfg, to, text }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text);
    return { channel: "msteams", ...result };
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, deps }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const send =
      deps?.sendMSTeams ??
      ((to, text, opts) => sendMessageMSTeams({ cfg, to, text, mediaUrl: opts?.mediaUrl }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await send(to, text, { mediaUrl });
    return { channel: "msteams", ...result };
  },
  sendPoll: async ({ cfg, to, poll }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const maxSelections = poll.maxSelections ?? 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await sendPollMSTeams({
      cfg,
      to,
      question: poll.question,
      options: poll.options,
      maxSelections,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pollStore = createMSTeamsPollStoreFs();
    await pollStore.createPoll({
      id: result.pollId,
      question: poll.question,
      options: poll.options,
      maxSelections,
      createdAt: new Date().toISOString(),
      conversationId: result.conversationId,
      messageId: result.messageId,
      votes: {},
    });
    return result;
  },
};
