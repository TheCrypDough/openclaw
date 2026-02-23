/*
 * AUTO ANNOTATION
 * File: ui/src/ui/assistant-identity.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_ASSISTANT_NAME = 50;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_ASSISTANT_AVATAR = 200;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_ASSISTANT_NAME = "Assistant";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_ASSISTANT_AVATAR = "A";

export type AssistantIdentity = {
  agentId?: string | null;
  name: string;
  avatar: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function coerceIdentityValue(value: string | undefined, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAssistantIdentity(
  input?: Partial<AssistantIdentity> | null,
): AssistantIdentity {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = coerceIdentityValue(input?.name, MAX_ASSISTANT_NAME) ?? DEFAULT_ASSISTANT_NAME;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const avatar = coerceIdentityValue(input?.avatar ?? undefined, MAX_ASSISTANT_AVATAR) ?? null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId =
    typeof input?.agentId === "string" && input.agentId.trim() ? input.agentId.trim() : null;
  return { agentId, name, avatar };
}
