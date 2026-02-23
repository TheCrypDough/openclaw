/*
 * AUTO ANNOTATION
 * File: src/sessions/input-provenance.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const INPUT_PROVENANCE_KIND_VALUES = [
  "external_user",
  "inter_session",
  "internal_system",
] as const;

export type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];

export type InputProvenance = {
  kind: InputProvenanceKind;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isInputProvenanceKind(value: unknown): value is InputProvenanceKind {
  return (
    typeof value === "string" && (INPUT_PROVENANCE_KIND_VALUES as readonly string[]).includes(value)
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeInputProvenance(value: unknown): InputProvenance | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const record = value as Record<string, unknown>;
  if (!isInputProvenanceKind(record.kind)) {
    return undefined;
  }
  return {
    kind: record.kind,
    sourceSessionKey: normalizeOptionalString(record.sourceSessionKey),
    sourceChannel: normalizeOptionalString(record.sourceChannel),
    sourceTool: normalizeOptionalString(record.sourceTool),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyInputProvenanceToUserMessage(
  message: AgentMessage,
  inputProvenance: InputProvenance | undefined,
): AgentMessage {
  if (!inputProvenance) {
    return message;
  }
  if ((message as { role?: unknown }).role !== "user") {
    return message;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = normalizeInputProvenance((message as { provenance?: unknown }).provenance);
  if (existing) {
    return message;
  }
  return {
    ...(message as unknown as Record<string, unknown>),
    provenance: inputProvenance,
  } as unknown as AgentMessage;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isInterSessionInputProvenance(value: unknown): boolean {
  return normalizeInputProvenance(value)?.kind === "inter_session";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasInterSessionUserProvenance(
  message: { role?: unknown; provenance?: unknown } | undefined,
): boolean {
  if (!message || message.role !== "user") {
    return false;
  }
  return isInterSessionInputProvenance(message.provenance);
}
