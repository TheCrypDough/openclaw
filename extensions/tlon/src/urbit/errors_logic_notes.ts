/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/errors.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type UrbitErrorCode =
  | "invalid_url"
  | "http_error"
  | "auth_failed"
  | "missing_cookie"
  | "channel_not_open";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class UrbitError extends Error {
  readonly code: UrbitErrorCode;

  constructor(code: UrbitErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "UrbitError";
    this.code = code;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class UrbitUrlError extends UrbitError {
  constructor(message: string, options?: { cause?: unknown }) {
    super("invalid_url", message, options);
    this.name = "UrbitUrlError";
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class UrbitHttpError extends UrbitError {
  readonly status: number;
  readonly operation: string;
  readonly bodyText?: string;

  constructor(params: { operation: string; status: number; bodyText?: string; cause?: unknown }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const suffix = params.bodyText ? ` - ${params.bodyText}` : "";
    super("http_error", `${params.operation} failed: ${params.status}${suffix}`, {
      cause: params.cause,
    });
    this.name = "UrbitHttpError";
    this.status = params.status;
    this.operation = params.operation;
    this.bodyText = params.bodyText;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class UrbitAuthError extends UrbitError {
  constructor(
    code: "auth_failed" | "missing_cookie",
    message: string,
    options?: { cause?: unknown },
  ) {
    super(code, message, options);
    this.name = "UrbitAuthError";
  }
}
