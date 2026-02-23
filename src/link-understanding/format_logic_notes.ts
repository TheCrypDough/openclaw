/*
 * AUTO ANNOTATION
 * File: src/link-understanding/format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLinkUnderstandingBody(params: { body?: string; outputs: string[] }): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outputs = params.outputs.map((output) => output.trim()).filter(Boolean);
  if (outputs.length === 0) {
    return params.body ?? "";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = (params.body ?? "").trim();
  if (!base) {
    return outputs.join("\n");
  }
  return `${base}\n\n${outputs.join("\n")}`;
}
