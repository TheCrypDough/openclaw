/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/target-errors.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function missingTargetMessage(provider: string, hint?: string): string {
  return `Delivering to ${provider} requires target${formatTargetHint(hint)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function missingTargetError(provider: string, hint?: string): Error {
  return new Error(missingTargetMessage(provider, hint));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ambiguousTargetMessage(provider: string, raw: string, hint?: string): string {
  return `Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ambiguousTargetError(provider: string, raw: string, hint?: string): Error {
  return new Error(ambiguousTargetMessage(provider, raw, hint));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unknownTargetMessage(provider: string, raw: string, hint?: string): string {
  return `Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unknownTargetError(provider: string, raw: string, hint?: string): Error {
  return new Error(unknownTargetMessage(provider, raw, hint));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatTargetHint(hint?: string, withLabel = false): string {
  if (!hint) {
    return "";
  }
  return withLabel ? ` Hint: ${hint}` : ` ${hint}`;
}
