/*
 * AUTO ANNOTATION
 * File: src/link-understanding/detect.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isBlockedHostnameOrIp } from "../infra/net/ssrf.js";
import { DEFAULT_MAX_LINKS } from "./defaults.js";

// Remove markdown link syntax so only bare URLs are considered.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MARKDOWN_LINK_RE = /\[[^\]]*]\((https?:\/\/\S+?)\)/gi;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const BARE_LINK_RE = /https?:\/\/\S+/gi;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function stripMarkdownLinks(message: string): string {
  return message.replace(MARKDOWN_LINK_RE, " ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveMaxLinks(value?: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return DEFAULT_MAX_LINKS;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isAllowedUrl(raw: string): boolean {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    if (isBlockedHostnameOrIp(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractLinksFromMessage(message: string, opts?: { maxLinks?: number }): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const source = message?.trim();
  if (!source) {
    return [];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxLinks = resolveMaxLinks(opts?.maxLinks);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sanitized = stripMarkdownLinks(source);
  const seen = new Set<string>();
  const results: string[] = [];

  for (const match of sanitized.matchAll(BARE_LINK_RE)) {
    const raw = match[0]?.trim();
    if (!raw) {
      continue;
    }
    if (!isAllowedUrl(raw)) {
      continue;
    }
    if (seen.has(raw)) {
      continue;
    }
    seen.add(raw);
    results.push(raw);
    if (results.length >= maxLinks) {
      break;
    }
  }

  return results;
}
