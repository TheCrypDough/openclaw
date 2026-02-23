/*
 * AUTO ANNOTATION
 * File: src/agents/subagent-lifecycle-events.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_TARGET_KIND_SUBAGENT = "subagent" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_TARGET_KIND_ACP = "acp" as const;

export type SubagentLifecycleTargetKind =
  | typeof SUBAGENT_TARGET_KIND_SUBAGENT
  | typeof SUBAGENT_TARGET_KIND_ACP;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_REASON_COMPLETE = "subagent-complete" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_REASON_ERROR = "subagent-error" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_REASON_KILLED = "subagent-killed" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_REASON_SESSION_RESET = "session-reset" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_REASON_SESSION_DELETE = "session-delete" as const;

export type SubagentLifecycleEndedReason =
  | typeof SUBAGENT_ENDED_REASON_COMPLETE
  | typeof SUBAGENT_ENDED_REASON_ERROR
  | typeof SUBAGENT_ENDED_REASON_KILLED
  | typeof SUBAGENT_ENDED_REASON_SESSION_RESET
  | typeof SUBAGENT_ENDED_REASON_SESSION_DELETE;

export type SubagentSessionLifecycleEndedReason =
  | typeof SUBAGENT_ENDED_REASON_SESSION_RESET
  | typeof SUBAGENT_ENDED_REASON_SESSION_DELETE;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_OUTCOME_OK = "ok" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_OUTCOME_ERROR = "error" as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SUBAGENT_ENDED_OUTCOME_TIMEOUT = "timeout" as const;
export const SUBAGENT_ENDED_OUTCOME_KILLED = "killed" as const;
export const SUBAGENT_ENDED_OUTCOME_RESET = "reset" as const;
export const SUBAGENT_ENDED_OUTCOME_DELETED = "deleted" as const;

export type SubagentLifecycleEndedOutcome =
  | typeof SUBAGENT_ENDED_OUTCOME_OK
  | typeof SUBAGENT_ENDED_OUTCOME_ERROR
  | typeof SUBAGENT_ENDED_OUTCOME_TIMEOUT
  | typeof SUBAGENT_ENDED_OUTCOME_KILLED
  | typeof SUBAGENT_ENDED_OUTCOME_RESET
  | typeof SUBAGENT_ENDED_OUTCOME_DELETED;

export function resolveSubagentSessionEndedOutcome(
  reason: SubagentSessionLifecycleEndedReason,
): SubagentLifecycleEndedOutcome {
  if (reason === SUBAGENT_ENDED_REASON_SESSION_RESET) {
    return SUBAGENT_ENDED_OUTCOME_RESET;
  }
  return SUBAGENT_ENDED_OUTCOME_DELETED;
}
