/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/restart-request.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseRestartRequestParams(params: unknown): {
  sessionKey: string | undefined;
  note: string | undefined;
  restartDelayMs: number | undefined;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionKey =
    typeof (params as { sessionKey?: unknown }).sessionKey === "string"
      ? (params as { sessionKey?: string }).sessionKey?.trim() || undefined
      : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const note =
    typeof (params as { note?: unknown }).note === "string"
      ? (params as { note?: string }).note?.trim() || undefined
      : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const restartDelayMsRaw = (params as { restartDelayMs?: unknown }).restartDelayMs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const restartDelayMs =
    typeof restartDelayMsRaw === "number" && Number.isFinite(restartDelayMsRaw)
      ? Math.max(0, Math.floor(restartDelayMsRaw))
      : undefined;
  return { sessionKey, note, restartDelayMs };
}
