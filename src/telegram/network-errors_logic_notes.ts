/*
 * AUTO ANNOTATION
 * File: src/telegram/network-errors.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { extractErrorCode, formatErrorMessage } from "../infra/errors.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECOVERABLE_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "EPIPE",
  "ETIMEDOUT",
  "ESOCKETTIMEDOUT",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET",
  "UND_ERR_ABORTED",
  "ECONNABORTED",
  "ERR_NETWORK",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECOVERABLE_ERROR_NAMES = new Set([
  "AbortError",
  "TimeoutError",
  "ConnectTimeoutError",
  "HeadersTimeoutError",
  "BodyTimeoutError",
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECOVERABLE_MESSAGE_SNIPPETS = [
  "fetch failed",
  "typeerror: fetch failed",
  "undici",
  "network error",
  "network request",
  "client network socket disconnected",
  "socket hang up",
  "getaddrinfo",
  "timeout", // catch timeout messages not covered by error codes/names
  "timed out", // grammY getUpdates returns "timed out after X seconds" (not matched by "timeout")
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeCode(code?: string): string {
  return code?.trim().toUpperCase() ?? "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getErrorName(err: unknown): string {
  if (!err || typeof err !== "object") {
    return "";
  }
  return "name" in err ? String(err.name) : "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getErrorCode(err: unknown): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const direct = extractErrorCode(err);
  if (direct) {
    return direct;
  }
  if (!err || typeof err !== "object") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errno = (err as { errno?: unknown }).errno;
  if (typeof errno === "string") {
    return errno;
  }
  if (typeof errno === "number") {
    return String(errno);
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function collectErrorCandidates(err: unknown): unknown[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const queue = [err];
  const seen = new Set<unknown>();
  const candidates: unknown[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current == null || seen.has(current)) {
      continue;
    }
    seen.add(current);
    candidates.push(current);

    if (typeof current === "object") {
      const cause = (current as { cause?: unknown }).cause;
      if (cause && !seen.has(cause)) {
        queue.push(cause);
      }
      const reason = (current as { reason?: unknown }).reason;
      if (reason && !seen.has(reason)) {
        queue.push(reason);
      }
      const errors = (current as { errors?: unknown }).errors;
      if (Array.isArray(errors)) {
        for (const nested of errors) {
          if (nested && !seen.has(nested)) {
            queue.push(nested);
          }
        }
      }
      // Grammy's HttpError wraps the underlying error in .error (not .cause)
      // Only follow .error for HttpError to avoid widening the search graph
      if (getErrorName(current) === "HttpError") {
        const wrappedError = (current as { error?: unknown }).error;
        if (wrappedError && !seen.has(wrappedError)) {
          queue.push(wrappedError);
        }
      }
    }
  }

  return candidates;
}

export type TelegramNetworkErrorContext = "polling" | "send" | "webhook" | "unknown";

export function isRecoverableTelegramNetworkError(
  err: unknown,
  options: { context?: TelegramNetworkErrorContext; allowMessageMatch?: boolean } = {},
): boolean {
  if (!err) {
    return false;
  }
  const allowMessageMatch =
    typeof options.allowMessageMatch === "boolean"
      ? options.allowMessageMatch
      : options.context !== "send";

  for (const candidate of collectErrorCandidates(err)) {
    const code = normalizeCode(getErrorCode(candidate));
    if (code && RECOVERABLE_ERROR_CODES.has(code)) {
      return true;
    }

    const name = getErrorName(candidate);
    if (name && RECOVERABLE_ERROR_NAMES.has(name)) {
      return true;
    }

    if (allowMessageMatch) {
      const message = formatErrorMessage(candidate).toLowerCase();
      if (message && RECOVERABLE_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet))) {
        return true;
      }
    }
  }

  return false;
}
