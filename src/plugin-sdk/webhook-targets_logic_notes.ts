/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/webhook-targets.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { normalizeWebhookPath } from "./webhook-path.js";

export type RegisteredWebhookTarget<T> = {
  target: T;
  unregister: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerWebhookTarget<T extends { path: string }>(
  targetsByPath: Map<string, T[]>,
  target: T,
): RegisteredWebhookTarget<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = normalizeWebhookPath(target.path);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedTarget = { ...target, path: key };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = targetsByPath.get(key) ?? [];
  targetsByPath.set(key, [...existing, normalizedTarget]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unregister = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const updated = (targetsByPath.get(key) ?? []).filter((entry) => entry !== normalizedTarget);
    if (updated.length > 0) {
      targetsByPath.set(key, updated);
      return;
    }
    targetsByPath.delete(key);
  };
  return { target: normalizedTarget, unregister };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveWebhookTargets<T>(
  req: IncomingMessage,
  targetsByPath: Map<string, T[]>,
): { path: string; targets: T[] } | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = new URL(req.url ?? "/", "http://localhost");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const path = normalizeWebhookPath(url.pathname);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const targets = targetsByPath.get(path);
  if (!targets || targets.length === 0) {
    return null;
  }
  return { path, targets };
}

export type WebhookTargetMatchResult<T> =
  | { kind: "none" }
  | { kind: "single"; target: T }
  | { kind: "ambiguous" };

export function resolveSingleWebhookTarget<T>(
  targets: readonly T[],
  isMatch: (target: T) => boolean,
): WebhookTargetMatchResult<T> {
  let matched: T | undefined;
  for (const target of targets) {
    if (!isMatch(target)) {
      continue;
    }
    if (matched) {
      return { kind: "ambiguous" };
    }
    matched = target;
  }
  if (!matched) {
    return { kind: "none" };
  }
  return { kind: "single", target: matched };
}

export async function resolveSingleWebhookTargetAsync<T>(
  targets: readonly T[],
  isMatch: (target: T) => Promise<boolean>,
): Promise<WebhookTargetMatchResult<T>> {
  let matched: T | undefined;
  for (const target of targets) {
    if (!(await isMatch(target))) {
      continue;
    }
    if (matched) {
      return { kind: "ambiguous" };
    }
    matched = target;
  }
  if (!matched) {
    return { kind: "none" };
  }
  return { kind: "single", target: matched };
}

export function rejectNonPostWebhookRequest(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method === "POST") {
    return false;
  }
  res.statusCode = 405;
  res.setHeader("Allow", "POST");
  res.end("Method Not Allowed");
  return true;
}
