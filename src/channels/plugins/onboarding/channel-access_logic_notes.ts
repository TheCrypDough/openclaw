/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/onboarding/channel-access.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WizardPrompter } from "../../../wizard/prompts.js";

export type ChannelAccessPolicy = "allowlist" | "open" | "disabled";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseAllowlistEntries(raw: string): string[] {
  return String(raw ?? "")
    .split(/[,\n]/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatAllowlistEntries(entries: string[]): string {
  return entries
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join(", ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptChannelAccessPolicy(params: {
  prompter: WizardPrompter;
  label: string;
  currentPolicy?: ChannelAccessPolicy;
  allowOpen?: boolean;
  allowDisabled?: boolean;
}): Promise<ChannelAccessPolicy> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const options: Array<{ value: ChannelAccessPolicy; label: string }> = [
    { value: "allowlist", label: "Allowlist (recommended)" },
  ];
  if (params.allowOpen !== false) {
    options.push({ value: "open", label: "Open (allow all channels)" });
  }
  if (params.allowDisabled !== false) {
    options.push({ value: "disabled", label: "Disabled (block all channels)" });
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const initialValue = params.currentPolicy ?? "allowlist";
  return await params.prompter.select({
    message: `${params.label} access`,
    options,
    initialValue,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptChannelAllowlist(params: {
  prompter: WizardPrompter;
  label: string;
  currentEntries?: string[];
  placeholder?: string;
}): Promise<string[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const initialValue =
    params.currentEntries && params.currentEntries.length > 0
      ? formatAllowlistEntries(params.currentEntries)
      : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = await params.prompter.text({
    message: `${params.label} allowlist (comma-separated)`,
    placeholder: params.placeholder,
    initialValue,
  });
  return parseAllowlistEntries(raw);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function promptChannelAccessConfig(params: {
  prompter: WizardPrompter;
  label: string;
  currentPolicy?: ChannelAccessPolicy;
  currentEntries?: string[];
  placeholder?: string;
  allowOpen?: boolean;
  allowDisabled?: boolean;
  defaultPrompt?: boolean;
  updatePrompt?: boolean;
}): Promise<{ policy: ChannelAccessPolicy; entries: string[] } | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasEntries = (params.currentEntries ?? []).length > 0;
  const shouldPrompt = params.defaultPrompt ?? !hasEntries;
  const wants = await params.prompter.confirm({
    message: params.updatePrompt
      ? `Update ${params.label} access?`
      : `Configure ${params.label} access?`,
    initialValue: shouldPrompt,
  });
  if (!wants) {
    return null;
  }
  const policy = await promptChannelAccessPolicy({
    prompter: params.prompter,
    label: params.label,
    currentPolicy: params.currentPolicy,
    allowOpen: params.allowOpen,
    allowDisabled: params.allowDisabled,
  });
  if (policy !== "allowlist") {
    return { policy, entries: [] };
  }
  const entries = await promptChannelAllowlist({
    prompter: params.prompter,
    label: params.label,
    currentEntries: params.currentEntries,
    placeholder: params.placeholder,
  });
  return { policy, entries };
}
