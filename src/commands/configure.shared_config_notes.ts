# AUTOPLACEHOLDER_ANNOTATION: src/commands/configure.shared.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import {
  confirm as clackConfirm,
  intro as clackIntro,
  outro as clackOutro,
  select as clackSelect,
  text as clackText,
} from "@clack/prompts";
import { stylePromptHint, stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CONFIGURE_WIZARD_SECTIONS = [
  "workspace",
  "model",
  "web",
  "gateway",
  "daemon",
  "channels",
  "skills",
  "health",
] as const;

export type WizardSection = (typeof CONFIGURE_WIZARD_SECTIONS)[number];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseConfigureWizardSections(raw: unknown): {
  sections: WizardSection[];
  invalid: string[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sectionsRaw: string[] = Array.isArray(raw)
    ? raw.map((value: unknown) => (typeof value === "string" ? value.trim() : "")).filter(Boolean)
    : [];
  if (sectionsRaw.length === 0) {
    return { sections: [], invalid: [] };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const invalid = sectionsRaw.filter((s) => !CONFIGURE_WIZARD_SECTIONS.includes(s as never));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sections = sectionsRaw.filter((s): s is WizardSection =>
    CONFIGURE_WIZARD_SECTIONS.includes(s as never),
  );
  return { sections, invalid };
}

export type ChannelsWizardMode = "configure" | "remove";

export type ConfigureWizardParams = {
  command: "configure" | "update";
  sections?: WizardSection[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CONFIGURE_SECTION_OPTIONS: Array<{
  value: WizardSection;
  label: string;
  hint: string;
}> = [
  { value: "workspace", label: "Workspace", hint: "Set workspace + sessions" },
  { value: "model", label: "Model", hint: "Pick provider + credentials" },
  { value: "web", label: "Web tools", hint: "Configure Brave search + fetch" },
  { value: "gateway", label: "Gateway", hint: "Port, bind, auth, tailscale" },
  {
    value: "daemon",
    label: "Daemon",
    hint: "Install/manage the background service",
  },
  {
    value: "channels",
    label: "Channels",
    hint: "Link WhatsApp/Telegram/etc and defaults",
  },
  { value: "skills", label: "Skills", hint: "Install/enable workspace skills" },
  {
    value: "health",
    label: "Health check",
    hint: "Run gateway + channel checks",
  },
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const intro = (message: string) => clackIntro(stylePromptTitle(message) ?? message);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const outro = (message: string) => clackOutro(stylePromptTitle(message) ?? message);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const text = (params: Parameters<typeof clackText>[0]) =>
  clackText({
    ...params,
    message: stylePromptMessage(params.message),
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const confirm = (params: Parameters<typeof clackConfirm>[0]) =>
  clackConfirm({
    ...params,
    message: stylePromptMessage(params.message),
  });
export const select = <T>(params: Parameters<typeof clackSelect<T>>[0]) =>
  clackSelect({
    ...params,
    message: stylePromptMessage(params.message),
    options: params.options.map((opt) =>
      opt.hint === undefined ? opt : { ...opt, hint: stylePromptHint(opt.hint) },
    ),
  });
