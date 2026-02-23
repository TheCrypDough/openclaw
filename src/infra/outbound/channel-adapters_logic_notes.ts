/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/channel-adapters.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Separator, TextDisplay, type TopLevelComponents } from "@buape/carbon";
import type { ChannelId } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import { DiscordUiContainer } from "../../discord/ui.js";

export type CrossContextComponentsBuilder = (message: string) => TopLevelComponents[];

export type CrossContextComponentsFactory = (params: {
  originLabel: string;
  message: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => TopLevelComponents[];

export type ChannelMessageAdapter = {
  supportsComponentsV2: boolean;
  buildCrossContextComponents?: CrossContextComponentsFactory;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CrossContextContainerParams = {
  originLabel: string;
  message: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class CrossContextContainer extends DiscordUiContainer {
  constructor({ originLabel, message, cfg, accountId }: CrossContextContainerParams) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = message.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const components = [] as Array<TextDisplay | Separator>;
    if (trimmed) {
      components.push(new TextDisplay(message));
      components.push(new Separator({ divider: true, spacing: "small" }));
    }
    components.push(new TextDisplay(`*From ${originLabel}*`));
    super({ cfg, accountId, components });
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_ADAPTER: ChannelMessageAdapter = {
  supportsComponentsV2: false,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DISCORD_ADAPTER: ChannelMessageAdapter = {
  supportsComponentsV2: true,
  buildCrossContextComponents: ({ originLabel, message, cfg, accountId }) => [
    new CrossContextContainer({ originLabel, message, cfg, accountId }),
  ],
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getChannelMessageAdapter(channel: ChannelId): ChannelMessageAdapter {
  if (channel === "discord") {
    return DISCORD_ADAPTER;
  }
  return DEFAULT_ADAPTER;
}
