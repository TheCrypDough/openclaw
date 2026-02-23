/*
 * AUTO ANNOTATION
 * File: src/browser/pw-tools-core.activity.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  BrowserConsoleMessage,
  BrowserNetworkRequest,
  BrowserPageError,
} from "./pw-session.js";
import { ensurePageState, getPageForTargetId } from "./pw-session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getPageErrorsViaPlaywright(opts: {
  cdpUrl: string;
  targetId?: string;
  clear?: boolean;
}): Promise<{ errors: BrowserPageError[] }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const page = await getPageForTargetId(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const state = ensurePageState(page);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errors = [...state.errors];
  if (opts.clear) {
    state.errors = [];
  }
  return { errors };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getNetworkRequestsViaPlaywright(opts: {
  cdpUrl: string;
  targetId?: string;
  filter?: string;
  clear?: boolean;
}): Promise<{ requests: BrowserNetworkRequest[] }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const page = await getPageForTargetId(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const state = ensurePageState(page);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = [...state.requests];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filter = typeof opts.filter === "string" ? opts.filter.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const requests = filter ? raw.filter((r) => r.url.includes(filter)) : raw;
  if (opts.clear) {
    state.requests = [];
    state.requestIds = new WeakMap();
  }
  return { requests };
}

function consolePriority(level: string) {
  switch (level) {
    case "error":
      return 3;
    case "warning":
      return 2;
    case "info":
    case "log":
      return 1;
    case "debug":
      return 0;
    default:
      return 1;
  }
}

export async function getConsoleMessagesViaPlaywright(opts: {
  cdpUrl: string;
  targetId?: string;
  level?: string;
}): Promise<BrowserConsoleMessage[]> {
  const page = await getPageForTargetId(opts);
  const state = ensurePageState(page);
  if (!opts.level) {
    return [...state.console];
  }
  const min = consolePriority(opts.level);
  return state.console.filter((msg) => consolePriority(msg.type) >= min);
}
