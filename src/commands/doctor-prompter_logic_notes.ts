/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-prompter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { confirm, select } from "@clack/prompts";
import type { RuntimeEnv } from "../runtime.js";
import { stylePromptHint, stylePromptMessage } from "../terminal/prompt-style.js";
import { guardCancel } from "./onboard-helpers.js";

export type DoctorOptions = {
  workspaceSuggestions?: boolean;
  yes?: boolean;
  nonInteractive?: boolean;
  deep?: boolean;
  repair?: boolean;
  force?: boolean;
  generateGatewayToken?: boolean;
};

export type DoctorPrompter = {
  confirm: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
  confirmRepair: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
  confirmAggressive: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
  confirmSkipInNonInteractive: (params: Parameters<typeof confirm>[0]) => Promise<boolean>;
  select: <T>(params: Parameters<typeof select>[0], fallback: T) => Promise<T>;
  shouldRepair: boolean;
  shouldForce: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDoctorPrompter(params: {
  runtime: RuntimeEnv;
  options: DoctorOptions;
}): DoctorPrompter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const yes = params.options.yes === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requestedNonInteractive = params.options.nonInteractive === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldRepair = params.options.repair === true || yes;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldForce = params.options.force === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isTty = Boolean(process.stdin.isTTY);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nonInteractive = requestedNonInteractive || (!isTty && !yes);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const canPrompt = isTty && !yes && !nonInteractive;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const confirmDefault = async (p: Parameters<typeof confirm>[0]) => {
    if (nonInteractive) {
      return false;
    }
    if (shouldRepair) {
      return true;
    }
    if (!canPrompt) {
      return Boolean(p.initialValue ?? false);
    }
    return guardCancel(
      await confirm({
        ...p,
        message: stylePromptMessage(p.message),
      }),
      params.runtime,
    );
  };

  return {
    confirm: confirmDefault,
    confirmRepair: async (p) => {
      if (nonInteractive) {
        return false;
      }
      return confirmDefault(p);
    },
    confirmAggressive: async (p) => {
      if (nonInteractive) {
        return false;
      }
      if (shouldRepair && shouldForce) {
        return true;
      }
      if (shouldRepair && !shouldForce) {
        return false;
      }
      if (!canPrompt) {
        return Boolean(p.initialValue ?? false);
      }
      return guardCancel(
        await confirm({
          ...p,
          message: stylePromptMessage(p.message),
        }),
        params.runtime,
      );
    },
    confirmSkipInNonInteractive: async (p) => {
      if (nonInteractive) {
        return false;
      }
      if (shouldRepair) {
        return true;
      }
      return confirmDefault(p);
    },
    select: async <T>(p: Parameters<typeof select>[0], fallback: T) => {
      if (!canPrompt || shouldRepair) {
        return fallback;
      }
      return guardCancel(
        await select({
          ...p,
          message: stylePromptMessage(p.message),
          options: p.options.map((opt) =>
            opt.hint === undefined ? opt : { ...opt, hint: stylePromptHint(opt.hint) },
          ),
        }),
        params.runtime,
      ) as T;
    },
    shouldRepair,
    shouldForce,
  };
}
