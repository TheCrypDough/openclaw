/*
 * AUTO ANNOTATION
 * File: src/terminal/prompt-style.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isRich, theme } from "./theme.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const stylePromptMessage = (message: string): string =>
  isRich() ? theme.accent(message) : message;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const stylePromptTitle = (title?: string): string | undefined =>
  title && isRich() ? theme.heading(title) : title;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const stylePromptHint = (hint?: string): string | undefined =>
  hint && isRich() ? theme.muted(hint) : hint;
