/*
 * AUTO ANNOTATION
 * File: src/config/commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeChannelId } from "../channels/plugins/index.js";
import type { ChannelId } from "../channels/plugins/types.js";
import { isPlainObject } from "../infra/plain-object.js";
import type { CommandsConfig, NativeCommandsSetting } from "./types.js";

export type CommandFlagKey = {
  [K in keyof CommandsConfig]-?: Exclude<CommandsConfig[K], undefined> extends boolean ? K : never;
}[keyof CommandsConfig];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAutoDefault(providerId?: ChannelId): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = normalizeChannelId(providerId);
  if (!id) {
    return false;
  }
  if (id === "discord" || id === "telegram") {
    return true;
  }
  if (id === "slack") {
    return false;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNativeSkillsEnabled(params: {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean {
  return resolveNativeCommandSetting(params);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNativeCommandsEnabled(params: {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean {
  return resolveNativeCommandSetting(params);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveNativeCommandSetting(params: {
  providerId: ChannelId;
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean {
  const { providerId, providerSetting, globalSetting } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const setting = providerSetting === undefined ? globalSetting : providerSetting;
  if (setting === true) {
    return true;
  }
  if (setting === false) {
    return false;
  }
  return resolveAutoDefault(providerId);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isNativeCommandsExplicitlyDisabled(params: {
  providerSetting?: NativeCommandsSetting;
  globalSetting?: NativeCommandsSetting;
}): boolean {
  const { providerSetting, globalSetting } = params;
  if (providerSetting === false) {
    return true;
  }
  if (providerSetting === undefined) {
    return globalSetting === false;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getOwnCommandFlagValue(
  config: { commands?: unknown } | undefined,
  key: CommandFlagKey,
): unknown {
  const { commands } = config ?? {};
  if (!isPlainObject(commands) || !Object.hasOwn(commands, key)) {
    return undefined;
  }
  return commands[key];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isCommandFlagEnabled(
  config: { commands?: unknown } | undefined,
  key: CommandFlagKey,
): boolean {
  return getOwnCommandFlagValue(config, key) === true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isRestartEnabled(config?: { commands?: unknown }): boolean {
  return getOwnCommandFlagValue(config, "restart") !== false;
}
