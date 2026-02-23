/*
 * AUTO ANNOTATION
 * File: src/agents/announce-idempotency.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type AnnounceIdFromChildRunParams = {
  childSessionKey: string;
  childRunId: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildAnnounceIdFromChildRun(params: AnnounceIdFromChildRunParams): string {
  return `v1:${params.childSessionKey}:${params.childRunId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildAnnounceIdempotencyKey(announceId: string): string {
  return `announce:${announceId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveQueueAnnounceId(params: {
  announceId?: string;
  sessionKey: string;
  enqueuedAt: number;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const announceId = params.announceId?.trim();
  if (announceId) {
    return announceId;
  }
  // Backward-compatible fallback for queue items that predate announceId.
  return `legacy:${params.sessionKey}:${params.enqueuedAt}`;
}
