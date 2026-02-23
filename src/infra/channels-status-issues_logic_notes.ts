/*
 * AUTO ANNOTATION
 * File: src/infra/channels-status-issues.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listChannelPlugins } from "../channels/plugins/index.js";
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../channels/plugins/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectChannelStatusIssues(payload: Record<string, unknown>): ChannelStatusIssue[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: ChannelStatusIssue[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountsByChannel = payload.channelAccounts as Record<string, unknown> | undefined;
  for (const plugin of listChannelPlugins()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const collect = plugin.status?.collectStatusIssues;
    if (!collect) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = accountsByChannel?.[plugin.id];
    if (!Array.isArray(raw)) {
      continue;
    }

    issues.push(...collect(raw as ChannelAccountSnapshot[]));
  }
  return issues;
}
