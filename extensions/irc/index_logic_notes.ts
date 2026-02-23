/*
 * AUTO ANNOTATION
 * File: extensions/irc/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelPlugin, OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { ircPlugin } from "./src/channel.js";
import { setIrcRuntime } from "./src/runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const plugin = {
  id: "irc",
  name: "IRC",
  description: "IRC channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setIrcRuntime(api.runtime);
    api.registerChannel({ plugin: ircPlugin as ChannelPlugin });
  },
};

export default plugin;
