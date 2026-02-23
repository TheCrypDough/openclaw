/*
 * AUTO ANNOTATION
 * File: src/memory/batch-error-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BatchOutputErrorLike = {
  error?: { message?: string };
  response?: {
    body?: {
      error?: { message?: string };
    };
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractBatchErrorMessage(lines: BatchOutputErrorLike[]): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const first = lines.find((line) => line.error?.message || line.response?.body?.error);
  return (
    first?.error?.message ??
    (typeof first?.response?.body?.error?.message === "string"
      ? first?.response?.body?.error?.message
      : undefined)
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatUnavailableBatchError(err: unknown): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = err instanceof Error ? err.message : String(err);
  return message ? `error file unavailable: ${message}` : undefined;
}
