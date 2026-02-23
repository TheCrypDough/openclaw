/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/monitor/discovery.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "openclaw/plugin-sdk";
import { formatChangesDate } from "./utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchGroupChanges(
  api: { scry: (path: string) => Promise<unknown> },
  runtime: RuntimeEnv,
  daysAgo = 5,
) {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const changeDate = formatChangesDate(daysAgo);
    runtime.log?.(`[tlon] Fetching group changes since ${daysAgo} days ago (${changeDate})...`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const changes = await api.scry(`/groups-ui/v5/changes/${changeDate}.json`);
    if (changes) {
      runtime.log?.("[tlon] Successfully fetched changes data");
      return changes;
    }
    return null;
  } catch (error) {
    runtime.log?.(
      `[tlon] Failed to fetch changes (falling back to full init): ${(error as { message?: string })?.message ?? String(error)}`,
    );
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchAllChannels(
  api: { scry: (path: string) => Promise<unknown> },
  runtime: RuntimeEnv,
): Promise<string[]> {
  try {
    runtime.log?.("[tlon] Attempting auto-discovery of group channels...");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const changes = await fetchGroupChanges(api, runtime, 5);

    // oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let initData: any;
    if (changes) {
      runtime.log?.("[tlon] Changes data received, using full init for channel extraction");
      initData = await api.scry("/groups-ui/v6/init.json");
    } else {
      initData = await api.scry("/groups-ui/v6/init.json");
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channels: string[] = [];
    if (initData && initData.groups) {
      // oxlint-disable-next-line typescript/no-explicit-any
      for (const groupData of Object.values(initData.groups as Record<string, any>)) {
        if (groupData && typeof groupData === "object" && groupData.channels) {
          for (const channelNest of Object.keys(groupData.channels)) {
            if (channelNest.startsWith("chat/")) {
              channels.push(channelNest);
            }
          }
        }
      }
    }

    if (channels.length > 0) {
      runtime.log?.(`[tlon] Auto-discovered ${channels.length} chat channel(s)`);
      runtime.log?.(
        `[tlon] Channels: ${channels.slice(0, 5).join(", ")}${channels.length > 5 ? "..." : ""}`,
      );
    } else {
      runtime.log?.("[tlon] No chat channels found via auto-discovery");
      runtime.log?.("[tlon] Add channels manually to config: channels.tlon.groupChannels");
    }

    return channels;
  } catch (error) {
    runtime.log?.(
      `[tlon] Auto-discovery failed: ${(error as { message?: string })?.message ?? String(error)}`,
    );
    runtime.log?.(
      "[tlon] To monitor group channels, add them to config: channels.tlon.groupChannels",
    );
    runtime.log?.('[tlon] Example: ["chat/~host-ship/channel-name"]');
    return [];
  }
}
