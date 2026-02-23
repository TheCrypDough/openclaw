/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/last-route.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../../../auto-reply/templating.js";
import type { loadConfig } from "../../../config/config.js";
import { resolveStorePath, updateLastRoute } from "../../../config/sessions.js";
import { formatError } from "../../session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function trackBackgroundTask(
  backgroundTasks: Set<Promise<unknown>>,
  task: Promise<unknown>,
) {
  backgroundTasks.add(task);
  void task.finally(() => {
    backgroundTasks.delete(task);
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function updateLastRouteInBackground(params: {
  cfg: ReturnType<typeof loadConfig>;
  backgroundTasks: Set<Promise<unknown>>;
  storeAgentId: string;
  sessionKey: string;
  channel: "whatsapp";
  to: string;
  accountId?: string;
  ctx?: MsgContext;
  warn: (obj: unknown, msg: string) => void;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = resolveStorePath(params.cfg.session?.store, {
    agentId: params.storeAgentId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const task = updateLastRoute({
    storePath,
    sessionKey: params.sessionKey,
    deliveryContext: {
      channel: params.channel,
      to: params.to,
      accountId: params.accountId,
    },
    ctx: params.ctx,
  }).catch((err) => {
    params.warn(
      {
        error: formatError(err),
        storePath,
        sessionKey: params.sessionKey,
        to: params.to,
      },
      "failed updating last route",
    );
  });
  trackBackgroundTask(params.backgroundTasks, task);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function awaitBackgroundTasks(backgroundTasks: Set<Promise<unknown>>) {
  if (backgroundTasks.size === 0) {
    return Promise.resolve();
  }
  return Promise.allSettled(backgroundTasks).then(() => {
    backgroundTasks.clear();
  });
}
