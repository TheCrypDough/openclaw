/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/gateway-plugin.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { GatewayIntents, GatewayPlugin } from "@buape/carbon/gateway";
import { HttpsProxyAgent } from "https-proxy-agent";
import WebSocket from "ws";
import type { DiscordAccountConfig } from "../../config/types.js";
import { danger } from "../../globals.js";
import type { RuntimeEnv } from "../../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordGatewayIntents(
  intentsConfig?: import("../../config/types.discord.js").DiscordIntentsConfig,
): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let intents =
    GatewayIntents.Guilds |
    GatewayIntents.GuildMessages |
    GatewayIntents.MessageContent |
    GatewayIntents.DirectMessages |
    GatewayIntents.GuildMessageReactions |
    GatewayIntents.DirectMessageReactions |
    GatewayIntents.GuildVoiceStates;
  if (intentsConfig?.presence) {
    intents |= GatewayIntents.GuildPresences;
  }
  if (intentsConfig?.guildMembers) {
    intents |= GatewayIntents.GuildMembers;
  }
  return intents;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDiscordGatewayPlugin(params: {
  discordConfig: DiscordAccountConfig;
  runtime: RuntimeEnv;
}): GatewayPlugin {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const intents = resolveDiscordGatewayIntents(params.discordConfig?.intents);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const proxy = params.discordConfig?.proxy?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const options = {
    reconnect: { maxAttempts: 50 },
    intents,
    autoInteractions: true,
  };

  if (!proxy) {
    return new GatewayPlugin(options);
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = new HttpsProxyAgent<string>(proxy);

    params.runtime.log?.("discord: gateway proxy enabled");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    class ProxyGatewayPlugin extends GatewayPlugin {
      constructor() {
        super(options);
      }

      createWebSocket(url: string) {
        return new WebSocket(url, { agent });
      }
    }

    return new ProxyGatewayPlugin();
  } catch (err) {
    params.runtime.error?.(danger(`discord: invalid gateway proxy: ${String(err)}`));
    return new GatewayPlugin(options);
  }
}
