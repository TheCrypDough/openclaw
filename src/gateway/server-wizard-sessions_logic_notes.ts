/*
 * AUTO ANNOTATION
 * File: src/gateway/server-wizard-sessions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WizardSession } from "../wizard/session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createWizardSessionTracker() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const wizardSessions = new Map<string, WizardSession>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const findRunningWizard = (): string | null => {
    for (const [id, session] of wizardSessions) {
      if (session.getStatus() === "running") {
        return id;
      }
    }
    return null;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const purgeWizardSession = (id: string) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const session = wizardSessions.get(id);
    if (!session) {
      return;
    }
    if (session.getStatus() === "running") {
      return;
    }
    wizardSessions.delete(id);
  };

  return { wizardSessions, findRunningWizard, purgeWizardSession };
}
