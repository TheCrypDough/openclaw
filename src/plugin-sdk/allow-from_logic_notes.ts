/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/allow-from.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatAllowFromLowercase(params: {
  allowFrom: Array<string | number>;
  stripPrefixRe?: RegExp;
}): string[] {
  return params.allowFrom
    .map((entry) => String(entry).trim())
    .filter(Boolean)
    .map((entry) => (params.stripPrefixRe ? entry.replace(params.stripPrefixRe, "") : entry))
    .map((entry) => entry.toLowerCase());
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ParsedChatAllowTarget =
  | { kind: "chat_id"; chatId: number }
  | { kind: "chat_guid"; chatGuid: string }
  | { kind: "chat_identifier"; chatIdentifier: string }
  | { kind: "handle"; handle: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isAllowedParsedChatSender<TParsed extends ParsedChatAllowTarget>(params: {
  allowFrom: Array<string | number>;
  sender: string;
  chatId?: number | null;
  chatGuid?: string | null;
  chatIdentifier?: string | null;
  normalizeSender: (sender: string) => string;
  parseAllowTarget: (entry: string) => TParsed;
}): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowFrom = params.allowFrom.map((entry) => String(entry).trim());
  if (allowFrom.length === 0) {
    return false;
  }
  if (allowFrom.includes("*")) {
    return true;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderNormalized = params.normalizeSender(params.sender);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatId = params.chatId ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatGuid = params.chatGuid?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatIdentifier = params.chatIdentifier?.trim();

  for (const entry of allowFrom) {
    if (!entry) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = params.parseAllowTarget(entry);
    if (parsed.kind === "chat_id" && chatId !== undefined) {
      if (parsed.chatId === chatId) {
        return true;
      }
    } else if (parsed.kind === "chat_guid" && chatGuid) {
      if (parsed.chatGuid === chatGuid) {
        return true;
      }
    } else if (parsed.kind === "chat_identifier" && chatIdentifier) {
      if (parsed.chatIdentifier === chatIdentifier) {
        return true;
      }
    } else if (parsed.kind === "handle" && senderNormalized) {
      if (parsed.handle === senderNormalized) {
        return true;
      }
    }
  }
  return false;
}
