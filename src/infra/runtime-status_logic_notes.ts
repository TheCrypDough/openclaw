/*
 * AUTO ANNOTATION
 * File: src/infra/runtime-status.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RuntimeStatusFormatInput = {
  status?: string;
  pid?: number;
  state?: string;
  details?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatRuntimeStatusWithDetails({
  status,
  pid,
  state,
  details = [],
}: RuntimeStatusFormatInput): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtimeStatus = status ?? "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fullDetails: string[] = [];
  if (pid) {
    fullDetails.push(`pid ${pid}`);
  }
  if (state && state.toLowerCase() !== runtimeStatus) {
    fullDetails.push(`state ${state}`);
  }
  for (const detail of details) {
    if (detail) {
      fullDetails.push(detail);
    }
  }
  return fullDetails.length > 0 ? `${runtimeStatus} (${fullDetails.join(", ")})` : runtimeStatus;
}
