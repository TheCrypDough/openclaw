/*
 * AUTO ANNOTATION
 * File: src/channels/sender-label.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type SenderLabelParams = {
  name?: string;
  username?: string;
  tag?: string;
  e164?: string;
  id?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalize(value?: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSenderLabel(params: SenderLabelParams): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = normalize(params.name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const username = normalize(params.username);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tag = normalize(params.tag);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const e164 = normalize(params.e164);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = normalize(params.id);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const display = name ?? username ?? tag ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idPart = e164 ?? id ?? "";
  if (display && idPart && display !== idPart) {
    return `${display} (${idPart})`;
  }
  return display || idPart || null;
}

export function listSenderLabelCandidates(params: SenderLabelParams): string[] {
  const candidates = new Set<string>();
  const name = normalize(params.name);
  const username = normalize(params.username);
  const tag = normalize(params.tag);
  const e164 = normalize(params.e164);
  const id = normalize(params.id);

  if (name) {
    candidates.add(name);
  }
  if (username) {
    candidates.add(username);
  }
  if (tag) {
    candidates.add(tag);
  }
  if (e164) {
    candidates.add(e164);
  }
  if (id) {
    candidates.add(id);
  }
  const resolved = resolveSenderLabel(params);
  if (resolved) {
    candidates.add(resolved);
  }
  return Array.from(candidates);
}
