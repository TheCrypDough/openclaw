/*
 * AUTO ANNOTATION
 * File: src/gateway/test-http-response.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ServerResponse } from "node:http";
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeMockHttpResponse(): {
  res: ServerResponse;
  setHeader: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const setHeader = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const end = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = {
    headersSent: false,
    statusCode: 200,
    setHeader,
    end,
  } as unknown as ServerResponse;
  return { res, setHeader, end };
}
