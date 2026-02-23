/*
 * AUTO ANNOTATION
 * File: extensions/nostr/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { nostrPlugin } from "./src/channel.js";
import type { NostrProfile } from "./src/config-schema.js";
import { createNostrProfileHttpHandler } from "./src/nostr-profile-http.js";
import { setNostrRuntime, getNostrRuntime } from "./src/runtime.js";
import { resolveNostrAccount } from "./src/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const plugin = {
  id: "nostr",
  name: "Nostr",
  description: "Nostr DM channel plugin via NIP-04",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setNostrRuntime(api.runtime);
    api.registerChannel({ plugin: nostrPlugin });

    // Register HTTP handler for profile management
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const httpHandler = createNostrProfileHttpHandler({
      getConfigProfile: (accountId: string) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const runtime = getNostrRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const cfg = runtime.config.loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const account = resolveNostrAccount({ cfg, accountId });
        return account.profile;
      },
      updateConfigProfile: async (accountId: string, profile: NostrProfile) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const runtime = getNostrRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const cfg = runtime.config.loadConfig();

        // Build the config patch for channels.nostr.profile
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const channels = (cfg.channels ?? {}) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const nostrConfig = (channels.nostr ?? {}) as Record<string, unknown>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const updatedNostrConfig = {
          ...nostrConfig,
          profile,
        };

        const updatedChannels = {
          ...channels,
          nostr: updatedNostrConfig,
        };

        await runtime.config.writeConfigFile({
          ...cfg,
          channels: updatedChannels,
        });
      },
      getAccountInfo: (accountId: string) => {
        const runtime = getNostrRuntime();
        const cfg = runtime.config.loadConfig();
        const account = resolveNostrAccount({ cfg, accountId });
        if (!account.configured || !account.publicKey) {
          return null;
        }
        return {
          pubkey: account.publicKey,
          relays: account.relays,
        };
      },
      log: api.logger,
    });

    api.registerHttpHandler(httpHandler);
  },
};

export default plugin;
