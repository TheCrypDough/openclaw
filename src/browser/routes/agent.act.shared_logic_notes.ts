/*
 * AUTO ANNOTATION
 * File: src/browser/routes/agent.act.shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ACT_KINDS = [
  "click",
  "close",
  "drag",
  "evaluate",
  "fill",
  "hover",
  "scrollIntoView",
  "press",
  "resize",
  "select",
  "type",
  "wait",
] as const;

export type ActKind = (typeof ACT_KINDS)[number];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isActKind(value: unknown): value is ActKind {
  if (typeof value !== "string") {
    return false;
  }
  return (ACT_KINDS as readonly string[]).includes(value);
}

export type ClickButton = "left" | "right" | "middle";
export type ClickModifier = "Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ALLOWED_CLICK_MODIFIERS = new Set<ClickModifier>([
  "Alt",
  "Control",
  "ControlOrMeta",
  "Meta",
  "Shift",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseClickButton(raw: string): ClickButton | undefined {
  if (raw === "left" || raw === "right" || raw === "middle") {
    return raw;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseClickModifiers(raw: string[]): {
  modifiers?: ClickModifier[];
  error?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const invalid = raw.filter((m) => !ALLOWED_CLICK_MODIFIERS.has(m as ClickModifier));
  if (invalid.length) {
    return { error: "modifiers must be Alt|Control|ControlOrMeta|Meta|Shift" };
  }
  return { modifiers: raw.length ? (raw as ClickModifier[]) : undefined };
}
