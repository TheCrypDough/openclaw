/*
 * AUTO ANNOTATION
 * File: src/line/bot.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebhookRequestBody } from "@line/bot-sdk";
import type { Request, Response, NextFunction } from "express";
import type { OpenClawConfig } from "../config/config.js";
import { loadConfig } from "../config/config.js";
import { logVerbose } from "../globals.js";
import type { RuntimeEnv } from "../runtime.js";
import { resolveLineAccount } from "./accounts.js";
import { handleLineWebhookEvents } from "./bot-handlers.js";
import type { LineInboundContext } from "./bot-message-context.js";
import type { ResolvedLineAccount } from "./types.js";
import { startLineWebhook } from "./webhook.js";

export interface LineBotOptions {
  channelAccessToken: string;
  channelSecret: string;
  accountId?: string;
  runtime?: RuntimeEnv;
  config?: OpenClawConfig;
  mediaMaxMb?: number;
  onMessage?: (ctx: LineInboundContext) => Promise<void>;
}

export interface LineBot {
  handleWebhook: (body: WebhookRequestBody) => Promise<void>;
  account: ResolvedLineAccount;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createLineBot(opts: LineBotOptions): LineBot {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime: RuntimeEnv = opts.runtime ?? {
    log: console.log,
    error: console.error,
    exit: (code: number): never => {
      throw new Error(`exit ${code}`);
    },
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = opts.config ?? loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveLineAccount({
    cfg,
    accountId: opts.accountId,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaMaxBytes = (opts.mediaMaxMb ?? account.config.mediaMaxMb ?? 10) * 1024 * 1024;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const processMessage =
    opts.onMessage ??
    (async () => {
      logVerbose("line: no message handler configured");
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handleWebhook = async (body: WebhookRequestBody): Promise<void> => {
    if (!body.events || body.events.length === 0) {
      return;
    }

    await handleLineWebhookEvents(body.events, {
      cfg,
      account,
      runtime,
      mediaMaxBytes,
      processMessage,
    });
  };

  return {
    handleWebhook,
    account,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createLineWebhookCallback(
  bot: LineBot,
  channelSecret: string,
  path = "/line/webhook",
): { path: string; handler: (req: Request, res: Response, _next: NextFunction) => Promise<void> } {
  const { handler } = startLineWebhook({
    channelSecret,
    onEvents: bot.handleWebhook,
    path,
  });

  return { path, handler };
}
