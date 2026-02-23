/*
 * AUTO ANNOTATION
 * File: src/imessage/monitor/parse-notification.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IMessagePayload } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalStringOrNumber(value: unknown): value is string | number | null | undefined {
  return (
    value === undefined || value === null || typeof value === "string" || typeof value === "number"
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalNumber(value: unknown): value is number | null | undefined {
  return value === undefined || value === null || typeof value === "number";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalBoolean(value: unknown): value is boolean | null | undefined {
  return value === undefined || value === null || typeof value === "boolean";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalStringArray(value: unknown): value is string[] | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.every((entry) => typeof entry === "string"))
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOptionalAttachments(value: unknown): value is IMessagePayload["attachments"] {
  if (value === undefined || value === null) {
    return true;
  }
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((attachment) => {
    if (!isRecord(attachment)) {
      return false;
    }
    return (
      isOptionalString(attachment.original_path) &&
      isOptionalString(attachment.mime_type) &&
      isOptionalBoolean(attachment.missing)
    );
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseIMessageNotification(raw: unknown): IMessagePayload | null {
  if (!isRecord(raw)) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maybeMessage = raw.message;
  if (!isRecord(maybeMessage)) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message: IMessagePayload = maybeMessage;
  if (
    !isOptionalNumber(message.id) ||
    !isOptionalNumber(message.chat_id) ||
    !isOptionalString(message.sender) ||
    !isOptionalBoolean(message.is_from_me) ||
    !isOptionalString(message.text) ||
    !isOptionalStringOrNumber(message.reply_to_id) ||
    !isOptionalString(message.reply_to_text) ||
    !isOptionalString(message.reply_to_sender) ||
    !isOptionalString(message.created_at) ||
    !isOptionalAttachments(message.attachments) ||
    !isOptionalString(message.chat_identifier) ||
    !isOptionalString(message.chat_guid) ||
    !isOptionalString(message.chat_name) ||
    !isOptionalStringArray(message.participants) ||
    !isOptionalBoolean(message.is_group)
  ) {
    return null;
  }

  return message;
}
