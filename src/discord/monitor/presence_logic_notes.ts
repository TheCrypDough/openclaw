/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/presence.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Activity, UpdatePresenceData } from "@buape/carbon/gateway";
import type { DiscordAccountConfig } from "../../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CUSTOM_ACTIVITY_TYPE = 4;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CUSTOM_STATUS_NAME = "Custom Status";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordPresenceConfig = Pick<
  DiscordAccountConfig,
  "activity" | "status" | "activityType" | "activityUrl"
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordPresenceUpdate(
  config: DiscordPresenceConfig,
): UpdatePresenceData | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activityText = typeof config.activity === "string" ? config.activity.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const status = typeof config.status === "string" ? config.status.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activityType = config.activityType;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activityUrl = typeof config.activityUrl === "string" ? config.activityUrl.trim() : "";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasActivity = Boolean(activityText);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasStatus = Boolean(status);

  if (!hasActivity && !hasStatus) {
    return null;
  }

  const activities: Activity[] = [];

  if (hasActivity) {
    const resolvedType = activityType ?? DEFAULT_CUSTOM_ACTIVITY_TYPE;
    const activity: Activity =
      resolvedType === DEFAULT_CUSTOM_ACTIVITY_TYPE
        ? { name: CUSTOM_STATUS_NAME, type: resolvedType, state: activityText }
        : { name: activityText, type: resolvedType };

    if (resolvedType === 1 && activityUrl) {
      activity.url = activityUrl;
    }

    activities.push(activity);
  }

  return {
    since: null,
    activities,
    status: (status || "online") as UpdatePresenceData["status"],
    afk: false,
  };
}
