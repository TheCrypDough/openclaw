/*
 * AUTO ANNOTATION
 * File: src/terminal/links.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatTerminalLink } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DOCS_ROOT = "https://docs.openclaw.ai";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatDocsLink(
  path: string,
  label?: string,
  opts?: { fallback?: string; force?: boolean },
): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = path.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = trimmed.startsWith("http")
    ? trimmed
    : `${DOCS_ROOT}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  return formatTerminalLink(label ?? url, url, {
    fallback: opts?.fallback ?? url,
    force: opts?.force,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatDocsRootLink(label?: string): string {
  return formatTerminalLink(label ?? DOCS_ROOT, DOCS_ROOT, {
    fallback: DOCS_ROOT,
  });
}
