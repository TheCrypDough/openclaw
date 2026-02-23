/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/webhook-path.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeWebhookPath(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return "/";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) {
    return withSlash.slice(0, -1);
  }
  return withSlash;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveWebhookPath(params: {
  webhookPath?: string;
  webhookUrl?: string;
  defaultPath?: string | null;
}): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmedPath = params.webhookPath?.trim();
  if (trimmedPath) {
    return normalizeWebhookPath(trimmedPath);
  }
  if (params.webhookUrl?.trim()) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parsed = new URL(params.webhookUrl);
      return normalizeWebhookPath(parsed.pathname || "/");
    } catch {
      return null;
    }
  }
  return params.defaultPath ?? null;
}
