/*
 * AUTO ANNOTATION
 * File: src/auto-reply/model.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { escapeRegExp } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractModelDirective(
  body?: string,
  options?: { aliases?: string[] },
): {
  cleaned: string;
  rawModel?: string;
  rawProfile?: string;
  hasDirective: boolean;
} {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelMatch = body.match(
    /(?:^|\s)\/model(?=$|\s|:)\s*:?\s*([A-Za-z0-9_.:@-]+(?:\/[A-Za-z0-9_.:@-]+)*)?/i,
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliases = (options?.aliases ?? []).map((alias) => alias.trim()).filter(Boolean);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const aliasMatch =
    modelMatch || aliases.length === 0
      ? null
      : body.match(
          new RegExp(
            `(?:^|\\s)\\/(${aliases.map(escapeRegExp).join("|")})(?=$|\\s|:)(?:\\s*:\\s*)?`,
            "i",
          ),
        );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = modelMatch ?? aliasMatch;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = modelMatch ? modelMatch?.[1]?.trim() : aliasMatch?.[1]?.trim();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let rawModel = raw;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let rawProfile: string | undefined;
  if (raw?.includes("@")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parts = raw.split("@");
    rawModel = parts[0]?.trim();
    rawProfile = parts.slice(1).join("@").trim() || undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = match ? body.replace(match[0], " ").replace(/\s+/g, " ").trim() : body.trim();

  return {
    cleaned,
    rawModel,
    rawProfile,
    hasDirective: !!match,
  };
}
