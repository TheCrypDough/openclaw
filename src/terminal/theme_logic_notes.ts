/*
 * AUTO ANNOTATION
 * File: src/terminal/theme.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import chalk, { Chalk } from "chalk";
import { LOBSTER_PALETTE } from "./palette.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hasForceColor =
  typeof process.env.FORCE_COLOR === "string" &&
  process.env.FORCE_COLOR.trim().length > 0 &&
  process.env.FORCE_COLOR.trim() !== "0";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hex = (value: string) => baseChalk.hex(value);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const theme = {
  accent: hex(LOBSTER_PALETTE.accent),
  accentBright: hex(LOBSTER_PALETTE.accentBright),
  accentDim: hex(LOBSTER_PALETTE.accentDim),
  info: hex(LOBSTER_PALETTE.info),
  success: hex(LOBSTER_PALETTE.success),
  warn: hex(LOBSTER_PALETTE.warn),
  error: hex(LOBSTER_PALETTE.error),
  muted: hex(LOBSTER_PALETTE.muted),
  heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
  command: hex(LOBSTER_PALETTE.accentBright),
  option: hex(LOBSTER_PALETTE.warn),
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const isRich = () => Boolean(baseChalk.level > 0);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const colorize = (rich: boolean, color: (value: string) => string, value: string) =>
  rich ? color(value) : value;
