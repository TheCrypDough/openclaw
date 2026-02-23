/*
 * AUTO ANNOTATION
 * File: src/auto-reply/commands-args.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { CommandArgValues } from "./commands-registry.types.js";

export type CommandArgsFormatter = (values: CommandArgValues) => string | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeArgValue(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let text: string;
  if (typeof value === "string") {
    text = value.trim();
  } else if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    text = String(value).trim();
  } else if (typeof value === "symbol") {
    text = value.toString().trim();
  } else if (typeof value === "function") {
    text = value.toString().trim();
  } else {
    // Objects and arrays
    text = JSON.stringify(value);
  }
  return text ? text : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatActionArgs(
  values: CommandArgValues,
  params: {
    formatKnownAction: (action: string, path: string | undefined) => string | undefined;
  },
): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = normalizeArgValue(values.action)?.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const path = normalizeArgValue(values.path);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = normalizeArgValue(values.value);
  if (!action) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const knownAction = params.formatKnownAction(action, path);
  if (knownAction) {
    return knownAction;
  }
  return formatSetUnsetArgAction(action, { path, value });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const formatConfigArgs: CommandArgsFormatter = (values) =>
  formatActionArgs(values, {
    formatKnownAction: (action, path) => {
      if (action === "show" || action === "get") {
        return path ? `${action} ${path}` : action;
      }
      return undefined;
    },
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const formatDebugArgs: CommandArgsFormatter = (values) =>
  formatActionArgs(values, {
    formatKnownAction: (action) => {
      if (action === "show" || action === "reset") {
        return action;
      }
      return undefined;
    },
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatSetUnsetArgAction(
  action: string,
  params: { path: string | undefined; value: string | undefined },
): string {
  if (action === "unset") {
    return params.path ? `${action} ${params.path}` : action;
  }
  if (action === "set") {
    if (!params.path) {
      return action;
    }
    if (!params.value) {
      return `${action} ${params.path}`;
    }
    return `${action} ${params.path}=${params.value}`;
  }
  return action;
}

const formatQueueArgs: CommandArgsFormatter = (values) => {
  const mode = normalizeArgValue(values.mode);
  const debounce = normalizeArgValue(values.debounce);
  const cap = normalizeArgValue(values.cap);
  const drop = normalizeArgValue(values.drop);
  const parts: string[] = [];
  if (mode) {
    parts.push(mode);
  }
  if (debounce) {
    parts.push(`debounce:${debounce}`);
  }
  if (cap) {
    parts.push(`cap:${cap}`);
  }
  if (drop) {
    parts.push(`drop:${drop}`);
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
};

const formatExecArgs: CommandArgsFormatter = (values) => {
  const host = normalizeArgValue(values.host);
  const security = normalizeArgValue(values.security);
  const ask = normalizeArgValue(values.ask);
  const node = normalizeArgValue(values.node);
  const parts: string[] = [];
  if (host) {
    parts.push(`host=${host}`);
  }
  if (security) {
    parts.push(`security=${security}`);
  }
  if (ask) {
    parts.push(`ask=${ask}`);
  }
  if (node) {
    parts.push(`node=${node}`);
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
};

export const COMMAND_ARG_FORMATTERS: Record<string, CommandArgsFormatter> = {
  config: formatConfigArgs,
  debug: formatDebugArgs,
  queue: formatQueueArgs,
  exec: formatExecArgs,
};
