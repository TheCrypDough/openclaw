/*
 * AUTO ANNOTATION
 * File: src/cron/payload-migration.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UnknownRecord = Record<string, unknown>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeChannel(value: string): string {
  return value.trim().toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function migrateLegacyCronPayload(payload: UnknownRecord): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let mutated = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelValue = readString(payload.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerValue = readString(payload.provider);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nextChannel =
    typeof channelValue === "string" && channelValue.trim().length > 0
      ? normalizeChannel(channelValue)
      : typeof providerValue === "string" && providerValue.trim().length > 0
        ? normalizeChannel(providerValue)
        : "";

  if (nextChannel) {
    if (channelValue !== nextChannel) {
      payload.channel = nextChannel;
      mutated = true;
    }
  }

  if ("provider" in payload) {
    delete payload.provider;
    mutated = true;
  }

  return mutated;
}
