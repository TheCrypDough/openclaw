/*
 * AUTO ANNOTATION
 * File: src/config/telegram-custom-commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TELEGRAM_COMMAND_NAME_PATTERN = /^[a-z0-9_]{1,32}$/;

export type TelegramCustomCommandInput = {
  command?: string | null;
  description?: string | null;
};

export type TelegramCustomCommandIssue = {
  index: number;
  field: "command" | "description";
  message: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeTelegramCommandName(value: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withoutSlash = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return withoutSlash.trim().toLowerCase().replace(/-/g, "_");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeTelegramCommandDescription(value: string): string {
  return value.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramCustomCommands(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
  checkDuplicates?: boolean;
}): {
  commands: Array<{ command: string; description: string }>;
  issues: TelegramCustomCommandIssue[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = Array.isArray(params.commands) ? params.commands : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reserved = params.reservedCommands ?? new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const checkReserved = params.checkReserved !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const checkDuplicates = params.checkDuplicates !== false;
  const seen = new Set<string>();
  const resolved: Array<{ command: string; description: string }> = [];
  const issues: TelegramCustomCommandIssue[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const normalized = normalizeTelegramCommandName(String(entry?.command ?? ""));
    if (!normalized) {
      issues.push({
        index,
        field: "command",
        message: "Telegram custom command is missing a command name.",
      });
      continue;
    }
    if (!TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" is invalid (use a-z, 0-9, underscore; max 32 chars).`,
      });
      continue;
    }
    if (checkReserved && reserved.has(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" conflicts with a native command.`,
      });
      continue;
    }
    if (checkDuplicates && seen.has(normalized)) {
      issues.push({
        index,
        field: "command",
        message: `Telegram custom command "/${normalized}" is duplicated.`,
      });
      continue;
    }
    const description = normalizeTelegramCommandDescription(String(entry?.description ?? ""));
    if (!description) {
      issues.push({
        index,
        field: "description",
        message: `Telegram custom command "/${normalized}" is missing a description.`,
      });
      continue;
    }
    if (checkDuplicates) {
      seen.add(normalized);
    }
    resolved.push({ command: normalized, description });
  }

  return { commands: resolved, issues };
}
