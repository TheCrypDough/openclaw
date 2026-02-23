/*
 * AUTO ANNOTATION
 * File: src/commands/message.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  CHANNEL_MESSAGE_ACTION_NAMES,
  type ChannelMessageActionName,
} from "../channels/plugins/types.js";
import { createOutboundSendDeps, type CliDeps } from "../cli/outbound-send-deps.js";
import { withProgress } from "../cli/progress.js";
import { loadConfig } from "../config/config.js";
import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import { runMessageAction } from "../infra/outbound/message-action-runner.js";
import type { RuntimeEnv } from "../runtime.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
import { buildMessageCliJson, formatMessageCliText } from "./message-format.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function messageCommand(
  opts: Record<string, unknown>,
  deps: CliDeps,
  runtime: RuntimeEnv,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawAction = typeof opts.action === "string" ? opts.action.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actionInput = rawAction || "send";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actionMatch = (CHANNEL_MESSAGE_ACTION_NAMES as readonly string[]).find(
    (name) => name.toLowerCase() === actionInput.toLowerCase(),
  );
  if (!actionMatch) {
    throw new Error(`Unknown message action: ${actionInput}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = actionMatch as ChannelMessageActionName;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outboundDeps: OutboundSendDeps = createOutboundSendDeps(deps);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const run = async () =>
    await runMessageAction({
      cfg,
      action,
      params: opts,
      deps: outboundDeps,
      gateway: {
        clientName: GATEWAY_CLIENT_NAMES.CLI,
        mode: GATEWAY_CLIENT_MODES.CLI,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const json = opts.json === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dryRun = opts.dryRun === true;
  const needsSpinner = !json && !dryRun && (action === "send" || action === "poll");

  const result = needsSpinner
    ? await withProgress(
        {
          label: action === "poll" ? "Sending poll..." : "Sending...",
          indeterminate: true,
          enabled: true,
        },
        run,
      )
    : await run();

  if (json) {
    runtime.log(JSON.stringify(buildMessageCliJson(result), null, 2));
    return;
  }

  for (const line of formatMessageCliText(result)) {
    runtime.log(line);
  }
}
