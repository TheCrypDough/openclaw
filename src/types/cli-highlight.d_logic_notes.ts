/*
 * AUTO ANNOTATION
 * File: src/types/cli-highlight.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "cli-highlight" {
  export type HighlightOptions = {
    language?: string;
    theme?: unknown;
    ignoreIllegals?: boolean;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function highlight(code: string, options?: HighlightOptions): string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function supportsLanguage(language: string): boolean;
}
