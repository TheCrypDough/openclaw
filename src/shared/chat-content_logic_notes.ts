/*
 * AUTO ANNOTATION
 * File: src/shared/chat-content.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractTextFromChatContent(
  content: unknown,
  opts?: {
    sanitizeText?: (text: string) => string;
    joinWith?: string;
    normalizeText?: (text: string) => string;
  },
): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalize = opts?.normalizeText ?? ((text: string) => text.replace(/\s+/g, " ").trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const joinWith = opts?.joinWith ?? " ";

  if (typeof content === "string") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = opts?.sanitizeText ? opts.sanitizeText(content) : content;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalize(value);
    return normalized ? normalized : null;
  }

  if (!Array.isArray(content)) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunks: string[] = [];
  for (const block of content) {
    if (!block || typeof block !== "object") {
      continue;
    }
    if ((block as { type?: unknown }).type !== "text") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = (block as { text?: unknown }).text;
    if (typeof text !== "string") {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = opts?.sanitizeText ? opts.sanitizeText(text) : text;
    if (value.trim()) {
      chunks.push(value);
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const joined = normalize(chunks.join(joinWith));
  return joined ? joined : null;
}
