/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/body.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SessionEntry } from "../../config/sessions.js";
import { updateSessionStore } from "../../config/sessions.js";
import { setAbortMemory } from "./abort.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applySessionHints(params: {
  baseBody: string;
  abortedLastRun: boolean;
  sessionEntry?: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  storePath?: string;
  abortKey?: string;
}): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let prefixedBodyBase = params.baseBody;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abortedHint = params.abortedLastRun
    ? "Note: The previous agent run was aborted by the user. Resume carefully or ask for clarification."
    : "";
  if (abortedHint) {
    prefixedBodyBase = `${abortedHint}\n\n${prefixedBodyBase}`;
    if (params.sessionEntry && params.sessionStore && params.sessionKey) {
      params.sessionEntry.abortedLastRun = false;
      params.sessionEntry.updatedAt = Date.now();
      params.sessionStore[params.sessionKey] = params.sessionEntry;
      if (params.storePath) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const sessionKey = params.sessionKey;
        await updateSessionStore(params.storePath, (store) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const entry = store[sessionKey] ?? params.sessionEntry;
          if (!entry) {
            return;
          }
          store[sessionKey] = {
            ...entry,
            abortedLastRun: false,
            updatedAt: Date.now(),
          };
        });
      }
    } else if (params.abortKey) {
      setAbortMemory(params.abortKey, false);
    }
  }

  return prefixedBodyBase;
}
