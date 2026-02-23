/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/provider.lifecycle.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Client } from "@buape/carbon";
import type { GatewayPlugin } from "@buape/carbon/gateway";
import { danger } from "../../globals.js";
import type { RuntimeEnv } from "../../runtime.js";
import { attachDiscordGatewayLogging } from "../gateway-logging.js";
import { getDiscordGatewayEmitter, waitForDiscordGatewayStop } from "../monitor.gateway.js";
import type { DiscordVoiceManager } from "../voice/manager.js";
import { registerGateway, unregisterGateway } from "./gateway-registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ExecApprovalsHandler = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runDiscordGatewayLifecycle(params: {
  accountId: string;
  client: Client;
  runtime: RuntimeEnv;
  abortSignal?: AbortSignal;
  isDisallowedIntentsError: (err: unknown) => boolean;
  voiceManager: DiscordVoiceManager | null;
  voiceManagerRef: { current: DiscordVoiceManager | null };
  execApprovalsHandler: ExecApprovalsHandler | null;
  threadBindings: { stop: () => void };
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const gateway = params.client.getPlugin<GatewayPlugin>("gateway");
  if (gateway) {
    registerGateway(params.accountId, gateway);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const gatewayEmitter = getDiscordGatewayEmitter(gateway);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stopGatewayLogging = attachDiscordGatewayLogging({
    emitter: gatewayEmitter,
    runtime: params.runtime,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onAbort = () => {
    if (!gateway) {
      return;
    }
    gatewayEmitter?.once("error", () => {});
    gateway.options.reconnect = { maxAttempts: 0 };
    gateway.disconnect();
  };

  if (params.abortSignal?.aborted) {
    onAbort();
  } else {
    params.abortSignal?.addEventListener("abort", onAbort, { once: true });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const HELLO_TIMEOUT_MS = 30000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let helloTimeoutId: ReturnType<typeof setTimeout> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onGatewayDebug = (msg: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = String(msg);
    if (!message.includes("WebSocket connection opened")) {
      return;
    }
    if (helloTimeoutId) {
      clearTimeout(helloTimeoutId);
    }
    helloTimeoutId = setTimeout(() => {
      if (!gateway?.isConnected) {
        params.runtime.log?.(
          danger(
            `connection stalled: no HELLO received within ${HELLO_TIMEOUT_MS}ms, forcing reconnect`,
          ),
        );
        gateway?.disconnect();
        gateway?.connect(false);
      }
      helloTimeoutId = undefined;
    }, HELLO_TIMEOUT_MS);
  };
  gatewayEmitter?.on("debug", onGatewayDebug);

  let sawDisallowedIntents = false;
  try {
    if (params.execApprovalsHandler) {
      await params.execApprovalsHandler.start();
    }

    await waitForDiscordGatewayStop({
      gateway: gateway
        ? {
            emitter: gatewayEmitter,
            disconnect: () => gateway.disconnect(),
          }
        : undefined,
      abortSignal: params.abortSignal,
      onGatewayError: (err) => {
        if (params.isDisallowedIntentsError(err)) {
          sawDisallowedIntents = true;
          params.runtime.error?.(
            danger(
              "discord: gateway closed with code 4014 (missing privileged gateway intents). Enable the required intents in the Discord Developer Portal or disable them in config.",
            ),
          );
          return;
        }
        params.runtime.error?.(danger(`discord gateway error: ${String(err)}`));
      },
      shouldStopOnError: (err) => {
        const message = String(err);
        return (
          message.includes("Max reconnect attempts") ||
          message.includes("Fatal Gateway error") ||
          params.isDisallowedIntentsError(err)
        );
      },
    });
  } catch (err) {
    if (!sawDisallowedIntents && !params.isDisallowedIntentsError(err)) {
      throw err;
    }
  } finally {
    unregisterGateway(params.accountId);
    stopGatewayLogging();
    if (helloTimeoutId) {
      clearTimeout(helloTimeoutId);
    }
    gatewayEmitter?.removeListener("debug", onGatewayDebug);
    params.abortSignal?.removeEventListener("abort", onAbort);
    if (params.voiceManager) {
      await params.voiceManager.destroy();
      params.voiceManagerRef.current = null;
    }
    if (params.execApprovalsHandler) {
      await params.execApprovalsHandler.stop();
    }
    params.threadBindings.stop();
  }
}
