/*
 * AUTO ANNOTATION
 * File: src/line/http-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";

export type LineHttpRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RegisterLineHttpHandlerArgs = {
  path?: string | null;
  handler: LineHttpRequestHandler;
  log?: (message: string) => void;
  accountId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const lineHttpRoutes = new Map<string, LineHttpRequestHandler>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeLineWebhookPath(path?: string | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = path?.trim();
  if (!trimmed) {
    return "/line/webhook";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerLineHttpHandler(params: RegisterLineHttpHandlerArgs): () => void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedPath = normalizeLineWebhookPath(params.path);
  if (lineHttpRoutes.has(normalizedPath)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
    params.log?.(`line: webhook path ${normalizedPath} already registered${suffix}`);
    return () => {};
  }
  lineHttpRoutes.set(normalizedPath, params.handler);
  return () => {
    lineHttpRoutes.delete(normalizedPath);
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleLineHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = new URL(req.url ?? "/", "http://localhost");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handler = lineHttpRoutes.get(url.pathname);
  if (!handler) {
    return false;
  }
  await handler(req, res);
  return true;
}
