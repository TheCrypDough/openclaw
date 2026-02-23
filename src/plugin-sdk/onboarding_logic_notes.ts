/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/onboarding.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";
import type { WizardPrompter } from "../wizard/prompts.js";

export type PromptAccountIdParams = {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
  label: string;
  currentId?: string;
  listAccountIds: (cfg: OpenClawConfig) => string[];
  defaultAccountId: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptAccountId(params: PromptAccountIdParams): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existingIds = params.listAccountIds(params.cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const initial = params.currentId?.trim() || params.defaultAccountId || DEFAULT_ACCOUNT_ID;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const choice = await params.prompter.select({
    message: `${params.label} account`,
    options: [
      ...existingIds.map((id) => ({
        value: id,
        label: id === DEFAULT_ACCOUNT_ID ? "default (primary)" : id,
      })),
      { value: "__new__", label: "Add a new account" },
    ],
    initialValue: initial,
  });

  if (choice !== "__new__") {
    return normalizeAccountId(choice);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entered = await params.prompter.text({
    message: `New ${params.label} account id`,
    validate: (value) => (value?.trim() ? undefined : "Required"),
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeAccountId(String(entered));
  if (String(entered).trim() !== normalized) {
    await params.prompter.note(
      `Normalized account id to "${normalized}".`,
      `${params.label} account`,
    );
  }
  return normalized;
}
