/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/echo.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type EchoTracker = {
  rememberText: (
    text: string | undefined,
    opts: {
      combinedBody?: string;
      combinedBodySessionKey?: string;
      logVerboseMessage?: boolean;
    },
  ) => void;
  has: (key: string) => boolean;
  forget: (key: string) => void;
  buildCombinedKey: (params: { sessionKey: string; combinedBody: string }) => string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createEchoTracker(params: {
  maxItems?: number;
  logVerbose?: (msg: string) => void;
}): EchoTracker {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const recentlySent = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxItems = Math.max(1, params.maxItems ?? 100);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buildCombinedKey = (p: { sessionKey: string; combinedBody: string }) =>
    `combined:${p.sessionKey}:${p.combinedBody}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trim = () => {
    while (recentlySent.size > maxItems) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const firstKey = recentlySent.values().next().value;
      if (!firstKey) {
        break;
      }
      recentlySent.delete(firstKey);
    }
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rememberText: EchoTracker["rememberText"] = (text, opts) => {
    if (!text) {
      return;
    }
    recentlySent.add(text);
    if (opts.combinedBody && opts.combinedBodySessionKey) {
      recentlySent.add(
        buildCombinedKey({
          sessionKey: opts.combinedBodySessionKey,
          combinedBody: opts.combinedBody,
        }),
      );
    }
    if (opts.logVerboseMessage) {
      params.logVerbose?.(
        `Added to echo detection set (size now: ${recentlySent.size}): ${text.substring(0, 50)}...`,
      );
    }
    trim();
  };

  return {
    rememberText,
    has: (key) => recentlySent.has(key),
    forget: (key) => {
      recentlySent.delete(key);
    },
    buildCombinedKey,
  };
}
