/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice-prompt.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { buildAuthChoiceGroups } from "./auth-choice-options.js";
import type { AuthChoice } from "./onboard-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BACK_VALUE = "__back";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptAuthChoiceGrouped(params: {
  prompter: WizardPrompter;
  store: AuthProfileStore;
  includeSkip: boolean;
}): Promise<AuthChoice> {
  const { groups, skipOption } = buildAuthChoiceGroups(params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const availableGroups = groups.filter((group) => group.options.length > 0);

  while (true) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providerOptions = [
      ...availableGroups.map((group) => ({
        value: group.value,
        label: group.label,
        hint: group.hint,
      })),
      ...(skipOption ? [skipOption] : []),
    ];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providerSelection = (await params.prompter.select({
      message: "Model/auth provider",
      options: providerOptions,
    })) as string;

    if (providerSelection === "skip") {
      return "skip";
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const group = availableGroups.find((candidate) => candidate.value === providerSelection);

    if (!group || group.options.length === 0) {
      await params.prompter.note(
        "No auth methods available for that provider.",
        "Model/auth choice",
      );
      continue;
    }

    if (group.options.length === 1) {
      return group.options[0].value;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const methodSelection = await params.prompter.select({
      message: `${group.label} auth method`,
      options: [...group.options, { value: BACK_VALUE, label: "Back" }],
    });

    if (methodSelection === BACK_VALUE) {
      continue;
    }

    return methodSelection as AuthChoice;
  }
}
