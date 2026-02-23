/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/onboarding/helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { promptAccountId as promptAccountIdSdk } from "../../../plugin-sdk/onboarding.js";
import type { WizardPrompter } from "../../../wizard/prompts.js";
import type { PromptAccountId, PromptAccountIdParams } from "../onboarding-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const promptAccountId: PromptAccountId = async (params: PromptAccountIdParams) => {
  return await promptAccountIdSdk(params);
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function addWildcardAllowFrom(allowFrom?: Array<string | number> | null): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = (allowFrom ?? []).map((v) => String(v).trim()).filter(Boolean);
  if (!next.includes("*")) {
    next.push("*");
  }
  return next;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mergeAllowFromEntries(
  current: Array<string | number> | null | undefined,
  additions: Array<string | number>,
): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged = [...(current ?? []), ...additions].map((v) => String(v).trim()).filter(Boolean);
  return [...new Set(merged)];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AllowFromResolution = {
  input: string;
  resolved: boolean;
  id?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptResolvedAllowFrom(params: {
  prompter: WizardPrompter;
  existing: Array<string | number>;
  token?: string | null;
  message: string;
  placeholder: string;
  label: string;
  parseInputs: (value: string) => string[];
  parseId: (value: string) => string | null;
  invalidWithoutTokenNote: string;
  resolveEntries: (params: { token: string; entries: string[] }) => Promise<AllowFromResolution[]>;
}): Promise<string[]> {
  while (true) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entry = await params.prompter.text({
      message: params.message,
      placeholder: params.placeholder,
      initialValue: params.existing[0] ? String(params.existing[0]) : undefined,
      validate: (value) => (String(value ?? "").trim() ? undefined : "Required"),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parts = params.parseInputs(String(entry));
    if (!params.token) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const ids = parts.map(params.parseId).filter(Boolean) as string[];
      if (ids.length !== parts.length) {
        await params.prompter.note(params.invalidWithoutTokenNote, params.label);
        continue;
      }
      return mergeAllowFromEntries(params.existing, ids);
    }

    const results = await params
      .resolveEntries({
        token: params.token,
        entries: parts,
      })
      .catch(() => null);
    if (!results) {
      await params.prompter.note("Failed to resolve usernames. Try again.", params.label);
      continue;
    }
    const unresolved = results.filter((res) => !res.resolved || !res.id);
    if (unresolved.length > 0) {
      await params.prompter.note(
        `Could not resolve: ${unresolved.map((res) => res.input).join(", ")}`,
        params.label,
      );
      continue;
    }
    const ids = results.map((res) => res.id as string);
    return mergeAllowFromEntries(params.existing, ids);
  }
}
