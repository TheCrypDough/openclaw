/*
 * AUTO ANNOTATION
 * File: src/utils/reaction-level.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ReactionLevel = "off" | "ack" | "minimal" | "extensive";

export type ResolvedReactionLevel = {
  level: ReactionLevel;
  /** Whether ACK reactions (e.g., 👀 when processing) are enabled. */
  ackEnabled: boolean;
  /** Whether agent-controlled reactions are enabled. */
  agentReactionsEnabled: boolean;
  /** Guidance level for agent reactions (minimal = sparse, extensive = liberal). */
  agentReactionGuidance?: "minimal" | "extensive";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LEVELS = new Set<ReactionLevel>(["off", "ack", "minimal", "extensive"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseLevel(
  value: unknown,
): { kind: "missing" } | { kind: "invalid" } | { kind: "ok"; value: ReactionLevel } {
  if (value === undefined || value === null) {
    return { kind: "missing" };
  }
  if (typeof value !== "string") {
    return { kind: "invalid" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return { kind: "missing" };
  }
  if (LEVELS.has(trimmed as ReactionLevel)) {
    return { kind: "ok", value: trimmed as ReactionLevel };
  }
  return { kind: "invalid" };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveReactionLevel(params: {
  value: unknown;
  defaultLevel: ReactionLevel;
  invalidFallback: "ack" | "minimal";
}): ResolvedReactionLevel {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseLevel(params.value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effective =
    parsed.kind === "ok"
      ? parsed.value
      : parsed.kind === "missing"
        ? params.defaultLevel
        : params.invalidFallback;

  switch (effective) {
    case "off":
      return { level: "off", ackEnabled: false, agentReactionsEnabled: false };
    case "ack":
      return { level: "ack", ackEnabled: true, agentReactionsEnabled: false };
    case "minimal":
      return {
        level: "minimal",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "minimal",
      };
    case "extensive":
      return {
        level: "extensive",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "extensive",
      };
    default:
      return {
        level: "minimal",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "minimal",
      };
  }
}
