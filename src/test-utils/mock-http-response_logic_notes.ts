/*
 * AUTO ANNOTATION
 * File: src/test-utils/mock-http-response.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ServerResponse } from "node:http";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMockServerResponse(): ServerResponse & { body?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers: Record<string, string> = {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res: {
    headersSent: boolean;
    statusCode: number;
    body?: string;
    setHeader: (key: string, value: string) => unknown;
    end: (body?: string) => unknown;
  } = {
    headersSent: false,
    statusCode: 200,
    setHeader: (key: string, value: string) => {
      headers[key.toLowerCase()] = value;
      return res;
    },
    end: (body?: string) => {
      res.headersSent = true;
      res.body = body;
      return res;
    },
  };
  return res as unknown as ServerResponse & { body?: string };
}
