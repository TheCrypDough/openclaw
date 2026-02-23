/*
 * AUTO ANNOTATION
 * File: src/commands/models/list.format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { colorize, isRich as isRichTerminal, theme } from "../../terminal/theme.js";
export { maskApiKey } from "../../utils/mask-api-key.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const isRich = (opts?: { json?: boolean; plain?: boolean }) =>
  Boolean(isRichTerminal() && !opts?.json && !opts?.plain);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const pad = (value: string, size: number) => value.padEnd(size);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatKey = (key: string, rich: boolean) => colorize(rich, theme.warn, key);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatValue = (value: string, rich: boolean) => colorize(rich, theme.info, value);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatKeyValue = (
  key: string,
  value: string,
  rich: boolean,
  valueColor: (value: string) => string = theme.info,
) => `${formatKey(key, rich)}=${colorize(rich, valueColor, value)}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatSeparator = (rich: boolean) => colorize(rich, theme.muted, " | ");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const formatTag = (tag: string, rich: boolean) => {
  if (!rich) {
    return tag;
  }
  if (tag === "default") {
    return theme.success(tag);
  }
  if (tag === "image") {
    return theme.accentBright(tag);
  }
  if (tag === "configured") {
    return theme.accent(tag);
  }
  if (tag === "missing") {
    return theme.error(tag);
  }
  if (tag.startsWith("fallback#")) {
    return theme.warn(tag);
  }
  if (tag.startsWith("img-fallback#")) {
    return theme.warn(tag);
  }
  if (tag.startsWith("alias:")) {
    return theme.accentDim(tag);
  }
  return theme.muted(tag);
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const truncate = (value: string, max: number) => {
  if (value.length <= max) {
    return value;
  }
  if (max <= 3) {
    return value.slice(0, max);
  }
  return `${value.slice(0, max - 3)}...`;
};
