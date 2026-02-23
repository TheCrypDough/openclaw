/*
 * AUTO ANNOTATION
 * File: src/slack/http/registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";

export type SlackHttpRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RegisterSlackHttpHandlerArgs = {
  path?: string | null;
  handler: SlackHttpRequestHandler;
  log?: (message: string) => void;
  accountId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const slackHttpRoutes = new Map<string, SlackHttpRequestHandler>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSlackWebhookPath(path?: string | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = path?.trim();
  if (!trimmed) {
    return "/slack/events";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerSlackHttpHandler(params: RegisterSlackHttpHandlerArgs): () => void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedPath = normalizeSlackWebhookPath(params.path);
  if (slackHttpRoutes.has(normalizedPath)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
    params.log?.(`slack: webhook path ${normalizedPath} already registered${suffix}`);
    return () => {};
  }
  slackHttpRoutes.set(normalizedPath, params.handler);
  return () => {
    slackHttpRoutes.delete(normalizedPath);
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleSlackHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = new URL(req.url ?? "/", "http://localhost");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handler = slackHttpRoutes.get(url.pathname);
  if (!handler) {
    return false;
  }
  await handler(req, res);
  return true;
}
