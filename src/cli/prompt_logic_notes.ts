/*
 * AUTO ANNOTATION
 * File: src/cli/prompt.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { isVerbose, isYes } from "../globals.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptYesNo(question: string, defaultYes = false): Promise<boolean> {
  // Simple Y/N prompt honoring global --yes and verbosity flags.
  if (isVerbose() && isYes()) {
    return true;
  } // redundant guard when both flags set
  if (isYes()) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rl = readline.createInterface({ input, output });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = defaultYes ? " [Y/n] " : " [y/N] ";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const answer = (await rl.question(`${question}${suffix}`)).trim().toLowerCase();
  rl.close();
  if (!answer) {
    return defaultYes;
  }
  return answer.startsWith("y");
}
