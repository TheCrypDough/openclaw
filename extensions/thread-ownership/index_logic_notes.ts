/*
 * AUTO ANNOTATION
 * File: extensions/thread-ownership/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig, OpenClawPluginApi } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ThreadOwnershipConfig = {
  forwarderUrl?: string;
  abTestChannels?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];

// In-memory set of {channel}:{thread} keys where this agent was @-mentioned.
// Entries expire after 5 minutes.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mentionedThreads = new Map<string, number>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MENTION_TTL_MS = 5 * 60 * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function cleanExpiredMentions(): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
  for (const [key, ts] of mentionedThreads) {
    if (now - ts > MENTION_TTL_MS) {
      mentionedThreads.delete(key);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveOwnershipAgent(config: OpenClawConfig): { id: string; name: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const list = Array.isArray(config.agents?.list)
    ? config.agents.list.filter((entry): entry is AgentEntry =>
        Boolean(entry && typeof entry === "object"),
      )
    : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const selected = list.find((entry) => entry.default === true) ?? list[0];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id =
    typeof selected?.id === "string" && selected.id.trim() ? selected.id.trim() : "unknown";
  const identityName =
    typeof selected?.identity?.name === "string" ? selected.identity.name.trim() : "";
  const fallbackName = typeof selected?.name === "string" ? selected.name.trim() : "";
  const name = identityName || fallbackName;

  return { id, name };
}

export default function register(api: OpenClawPluginApi) {
  const pluginCfg = (api.pluginConfig ?? {}) as ThreadOwnershipConfig;
  const forwarderUrl = (
    pluginCfg.forwarderUrl ??
    process.env.SLACK_FORWARDER_URL ??
    "http://slack-forwarder:8750"
  ).replace(/\/$/, "");

  const abTestChannels = new Set(
    pluginCfg.abTestChannels ??
      process.env.THREAD_OWNERSHIP_CHANNELS?.split(",").filter(Boolean) ??
      [],
  );

  const { id: agentId, name: agentName } = resolveOwnershipAgent(api.config);
  const botUserId = process.env.SLACK_BOT_USER_ID ?? "";

  // ---------------------------------------------------------------------------
  // message_received: track @-mentions so the agent can reply even if it
  // doesn't own the thread.
  // ---------------------------------------------------------------------------
  api.on("message_received", async (event, ctx) => {
    if (ctx.channelId !== "slack") return;

    const text = event.content ?? "";
    const threadTs = (event.metadata?.threadTs as string) ?? "";
    const channelId = (event.metadata?.channelId as string) ?? ctx.conversationId ?? "";

    if (!threadTs || !channelId) return;

    // Check if this agent was @-mentioned.
    const mentioned =
      (agentName && text.includes(`@${agentName}`)) ||
      (botUserId && text.includes(`<@${botUserId}>`));

    if (mentioned) {
      cleanExpiredMentions();
      mentionedThreads.set(`${channelId}:${threadTs}`, Date.now());
    }
  });

  // ---------------------------------------------------------------------------
  // message_sending: check thread ownership before sending to Slack.
  // Returns { cancel: true } if another agent owns the thread.
  // ---------------------------------------------------------------------------
  api.on("message_sending", async (event, ctx) => {
    if (ctx.channelId !== "slack") return;

    const threadTs = (event.metadata?.threadTs as string) ?? "";
    const channelId = (event.metadata?.channelId as string) ?? event.to;

    // Top-level messages (no thread) are always allowed.
    if (!threadTs) return;

    // Only enforce in A/B test channels (if set is empty, skip entirely).
    if (abTestChannels.size > 0 && !abTestChannels.has(channelId)) return;

    // If this agent was @-mentioned in this thread recently, skip ownership check.
    cleanExpiredMentions();
    if (mentionedThreads.has(`${channelId}:${threadTs}`)) return;

    // Try to claim ownership via the forwarder HTTP API.
    try {
      const resp = await fetch(`${forwarderUrl}/api/v1/ownership/${channelId}/${threadTs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId }),
        signal: AbortSignal.timeout(3000),
      });

      if (resp.ok) {
        // We own it (or just claimed it), proceed.
        return;
      }

      if (resp.status === 409) {
        // Another agent owns this thread — cancel the send.
        const body = (await resp.json()) as { owner?: string };
        api.logger.info?.(
          `thread-ownership: cancelled send to ${channelId}:${threadTs} — owned by ${body.owner}`,
        );
        return { cancel: true };
      }

      // Unexpected status — fail open.
      api.logger.warn?.(`thread-ownership: unexpected status ${resp.status}, allowing send`);
    } catch (err) {
      // Network error — fail open.
      api.logger.warn?.(`thread-ownership: ownership check failed (${String(err)}), allowing send`);
    }
  });
}
