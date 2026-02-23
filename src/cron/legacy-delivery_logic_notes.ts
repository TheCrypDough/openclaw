/*
 * AUTO ANNOTATION
 * File: src/cron/legacy-delivery.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasLegacyDeliveryHints(payload: Record<string, unknown>) {
  if (typeof payload.deliver === "boolean") {
    return true;
  }
  if (typeof payload.bestEffortDeliver === "boolean") {
    return true;
  }
  if (typeof payload.to === "string" && payload.to.trim()) {
    return true;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDeliveryFromLegacyPayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deliver = payload.deliver;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = deliver === false ? "none" : "announce";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelRaw =
    typeof payload.channel === "string" ? payload.channel.trim().toLowerCase() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const toRaw = typeof payload.to === "string" ? payload.to.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next: Record<string, unknown> = { mode };
  if (channelRaw) {
    next.channel = channelRaw;
  }
  if (toRaw) {
    next.to = toRaw;
  }
  if (typeof payload.bestEffortDeliver === "boolean") {
    next.bestEffort = payload.bestEffortDeliver;
  }
  return next;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripLegacyDeliveryFields(payload: Record<string, unknown>) {
  if ("deliver" in payload) {
    delete payload.deliver;
  }
  if ("channel" in payload) {
    delete payload.channel;
  }
  if ("to" in payload) {
    delete payload.to;
  }
  if ("bestEffortDeliver" in payload) {
    delete payload.bestEffortDeliver;
  }
}
