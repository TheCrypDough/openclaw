/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/inbound.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type MentionableActivity = {
  recipient?: { id?: string } | null;
  entities?: Array<{
    type?: string;
    mentioned?: { id?: string };
  }> | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeMSTeamsConversationId(raw: string): string {
  return raw.split(";")[0] ?? raw;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractMSTeamsConversationMessageId(raw: string): string | undefined {
  if (!raw) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = /(?:^|;)messageid=([^;]+)/i.exec(raw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = match?.[1]?.trim() ?? "";
  return value || undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseMSTeamsActivityTimestamp(value: unknown): Date | undefined {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripMSTeamsMentionTags(text: string): string {
  // Teams wraps mentions in <at>...</at> tags
  return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function wasMSTeamsBotMentioned(activity: MentionableActivity): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const botId = activity.recipient?.id;
  if (!botId) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entities = activity.entities ?? [];
  return entities.some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
