/*
 * AUTO ANNOTATION
 * File: src/browser/pw-ai-module.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { extractErrorCode, formatErrorMessage } from "../infra/errors.js";

export type PwAiModule = typeof import("./pw-ai.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PwAiLoadMode = "soft" | "strict";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pwAiModuleSoft: Promise<PwAiModule | null> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let pwAiModuleStrict: Promise<PwAiModule | null> | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isModuleNotFoundError(err: unknown): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const code = extractErrorCode(err);
  if (code === "ERR_MODULE_NOT_FOUND") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const msg = formatErrorMessage(err);
  return (
    msg.includes("Cannot find module") ||
    msg.includes("Cannot find package") ||
    msg.includes("Failed to resolve import") ||
    msg.includes("Failed to resolve entry for package") ||
    msg.includes("Failed to load url")
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function loadPwAiModule(mode: PwAiLoadMode): Promise<PwAiModule | null> {
  try {
    return await import("./pw-ai.js");
  } catch (err) {
    if (mode === "soft") {
      return null;
    }
    if (isModuleNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getPwAiModule(opts?: { mode?: PwAiLoadMode }): Promise<PwAiModule | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode: PwAiLoadMode = opts?.mode ?? "soft";
  if (mode === "soft") {
    if (!pwAiModuleSoft) {
      pwAiModuleSoft = loadPwAiModule("soft");
    }
    return await pwAiModuleSoft;
  }
  if (!pwAiModuleStrict) {
    pwAiModuleStrict = loadPwAiModule("strict");
  }
  return await pwAiModuleStrict;
}
