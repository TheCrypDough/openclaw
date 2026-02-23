/*
 * AUTO ANNOTATION
 * File: src/browser/pw-tools-core.shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseRoleRef } from "./pw-role-snapshot.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let nextUploadArmId = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let nextDialogArmId = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let nextDownloadArmId = 0;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bumpUploadArmId(): number {
  nextUploadArmId += 1;
  return nextUploadArmId;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bumpDialogArmId(): number {
  nextDialogArmId += 1;
  return nextDialogArmId;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bumpDownloadArmId(): number {
  nextDownloadArmId += 1;
  return nextDownloadArmId;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requireRef(value: unknown): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = typeof value === "string" ? value.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const roleRef = raw ? parseRoleRef(raw) : null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ref = roleRef ?? (raw.startsWith("@") ? raw.slice(1) : raw);
  if (!ref) {
    throw new Error("ref is required");
  }
  return ref;
}

export function normalizeTimeoutMs(timeoutMs: number | undefined, fallback: number) {
  return Math.max(500, Math.min(120_000, timeoutMs ?? fallback));
}

export function toAIFriendlyError(error: unknown, selector: string): Error {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("strict mode violation")) {
    const countMatch = message.match(/resolved to (\d+) elements/);
    const count = countMatch ? countMatch[1] : "multiple";
    return new Error(
      `Selector "${selector}" matched ${count} elements. ` +
        `Run a new snapshot to get updated refs, or use a different ref.`,
    );
  }

  if (
    (message.includes("Timeout") || message.includes("waiting for")) &&
    (message.includes("to be visible") || message.includes("not visible"))
  ) {
    return new Error(
      `Element "${selector}" not found or not visible. ` +
        `Run a new snapshot to see current page elements.`,
    );
  }

  if (
    message.includes("intercepts pointer events") ||
    message.includes("not visible") ||
    message.includes("not receive pointer events")
  ) {
    return new Error(
      `Element "${selector}" is not interactable (hidden or covered). ` +
        `Try scrolling it into view, closing overlays, or re-snapshotting.`,
    );
  }

  return error instanceof Error ? error : new Error(message);
}
