/*
 * AUTO ANNOTATION
 * File: src/terminal/prompt-select-styled.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { select } from "@clack/prompts";
import { stylePromptHint, stylePromptMessage } from "./prompt-style.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function selectStyled<T>(params: Parameters<typeof select<T>>[0]) {
  return select({
    ...params,
    message: stylePromptMessage(params.message),
    options: params.options.map((opt) =>
      opt.hint === undefined ? opt : { ...opt, hint: stylePromptHint(opt.hint) },
    ),
  });
}
