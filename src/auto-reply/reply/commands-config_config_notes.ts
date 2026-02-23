# AUTOPLACEHOLDER_ANNOTATION: src/auto-reply/reply/commands-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { resolveChannelConfigWrites } from "../../channels/plugins/config-writes.js";
import { normalizeChannelId } from "../../channels/registry.js";
import {
  getConfigValueAtPath,
  parseConfigPath,
  setConfigValueAtPath,
  unsetConfigValueAtPath,
} from "../../config/config-paths.js";
import {
  readConfigFileSnapshot,
  validateConfigObjectWithPlugins,
  writeConfigFile,
} from "../../config/config.js";
import {
  getConfigOverrides,
  resetConfigOverrides,
  setConfigOverride,
  unsetConfigOverride,
} from "../../config/runtime-overrides.js";
import { rejectUnauthorizedCommand, requireCommandFlagEnabled } from "./command-gates.js";
import type { CommandHandler } from "./commands-types.js";
import { parseConfigCommand } from "./config-commands.js";
import { parseDebugCommand } from "./debug-commands.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const handleConfigCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configCommand = parseConfigCommand(params.command.commandBodyNormalized);
  if (!configCommand) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unauthorized = rejectUnauthorizedCommand(params, "/config");
  if (unauthorized) {
    return unauthorized;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const disabled = requireCommandFlagEnabled(params.cfg, {
    label: "/config",
    configKey: "config",
  });
  if (disabled) {
    return disabled;
  }
  if (configCommand.action === "error") {
    return {
      shouldContinue: false,
      reply: { text: `⚠️ ${configCommand.message}` },
    };
  }

  if (configCommand.action === "set" || configCommand.action === "unset") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelId = params.command.channelId ?? normalizeChannelId(params.command.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowWrites = resolveChannelConfigWrites({
      cfg: params.cfg,
      channelId,
      accountId: params.ctx.AccountId,
    });
    if (!allowWrites) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelLabel = channelId ?? "this channel";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const hint = channelId
        ? `channels.${channelId}.configWrites=true`
        : "channels.<channel>.configWrites=true";
      return {
        shouldContinue: false,
        reply: {
          text: `⚠️ Config writes are disabled for ${channelLabel}. Set ${hint} to enable.`,
        },
      };
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = await readConfigFileSnapshot();
  if (!snapshot.valid || !snapshot.parsed || typeof snapshot.parsed !== "object") {
    return {
      shouldContinue: false,
      reply: {
        text: "⚠️ Config file is invalid; fix it before using /config.",
      },
    };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsedBase = structuredClone(snapshot.parsed as Record<string, unknown>);

  if (configCommand.action === "show") {
    const pathRaw = configCommand.path?.trim();
    if (pathRaw) {
      const parsedPath = parseConfigPath(pathRaw);
      if (!parsedPath.ok || !parsedPath.path) {
        return {
          shouldContinue: false,
          reply: { text: `⚠️ ${parsedPath.error ?? "Invalid path."}` },
        };
      }
      const value = getConfigValueAtPath(parsedBase, parsedPath.path);
      const rendered = JSON.stringify(value ?? null, null, 2);
      return {
        shouldContinue: false,
        reply: {
          text: `⚙️ Config ${pathRaw}:\n\`\`\`json\n${rendered}\n\`\`\``,
        },
      };
    }
    const json = JSON.stringify(parsedBase, null, 2);
    return {
      shouldContinue: false,
      reply: { text: `⚙️ Config (raw):\n\`\`\`json\n${json}\n\`\`\`` },
    };
  }

  if (configCommand.action === "unset") {
    const parsedPath = parseConfigPath(configCommand.path);
    if (!parsedPath.ok || !parsedPath.path) {
      return {
        shouldContinue: false,
        reply: { text: `⚠️ ${parsedPath.error ?? "Invalid path."}` },
      };
    }
    const removed = unsetConfigValueAtPath(parsedBase, parsedPath.path);
    if (!removed) {
      return {
        shouldContinue: false,
        reply: { text: `⚙️ No config value found for ${configCommand.path}.` },
      };
    }
    const validated = validateConfigObjectWithPlugins(parsedBase);
    if (!validated.ok) {
      const issue = validated.issues[0];
      return {
        shouldContinue: false,
        reply: {
          text: `⚠️ Config invalid after unset (${issue.path}: ${issue.message}).`,
        },
      };
    }
    await writeConfigFile(validated.config);
    return {
      shouldContinue: false,
      reply: { text: `⚙️ Config updated: ${configCommand.path} removed.` },
    };
  }

  if (configCommand.action === "set") {
    const parsedPath = parseConfigPath(configCommand.path);
    if (!parsedPath.ok || !parsedPath.path) {
      return {
        shouldContinue: false,
        reply: { text: `⚠️ ${parsedPath.error ?? "Invalid path."}` },
      };
    }
    setConfigValueAtPath(parsedBase, parsedPath.path, configCommand.value);
    const validated = validateConfigObjectWithPlugins(parsedBase);
    if (!validated.ok) {
      const issue = validated.issues[0];
      return {
        shouldContinue: false,
        reply: {
          text: `⚠️ Config invalid after set (${issue.path}: ${issue.message}).`,
        },
      };
    }
    await writeConfigFile(validated.config);
    const valueLabel =
      typeof configCommand.value === "string"
        ? `"${configCommand.value}"`
        : JSON.stringify(configCommand.value);
    return {
      shouldContinue: false,
      reply: {
        text: `⚙️ Config updated: ${configCommand.path}=${valueLabel ?? "null"}`,
      },
    };
  }

  return null;
};

export const handleDebugCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }
  const debugCommand = parseDebugCommand(params.command.commandBodyNormalized);
  if (!debugCommand) {
    return null;
  }
  const unauthorized = rejectUnauthorizedCommand(params, "/debug");
  if (unauthorized) {
    return unauthorized;
  }
  const disabled = requireCommandFlagEnabled(params.cfg, {
    label: "/debug",
    configKey: "debug",
  });
  if (disabled) {
    return disabled;
  }
  if (debugCommand.action === "error") {
    return {
      shouldContinue: false,
      reply: { text: `⚠️ ${debugCommand.message}` },
    };
  }
  if (debugCommand.action === "show") {
    const overrides = getConfigOverrides();
    const hasOverrides = Object.keys(overrides).length > 0;
    if (!hasOverrides) {
      return {
        shouldContinue: false,
        reply: { text: "⚙️ Debug overrides: (none)" },
      };
    }
    const json = JSON.stringify(overrides, null, 2);
    return {
      shouldContinue: false,
      reply: {
        text: `⚙️ Debug overrides (memory-only):\n\`\`\`json\n${json}\n\`\`\``,
      },
    };
  }
  if (debugCommand.action === "reset") {
    resetConfigOverrides();
    return {
      shouldContinue: false,
      reply: { text: "⚙️ Debug overrides cleared; using config on disk." },
    };
  }
  if (debugCommand.action === "unset") {
    const result = unsetConfigOverride(debugCommand.path);
    if (!result.ok) {
      return {
        shouldContinue: false,
        reply: { text: `⚠️ ${result.error ?? "Invalid path."}` },
      };
    }
    if (!result.removed) {
      return {
        shouldContinue: false,
        reply: {
          text: `⚙️ No debug override found for ${debugCommand.path}.`,
        },
      };
    }
    return {
      shouldContinue: false,
      reply: { text: `⚙️ Debug override removed for ${debugCommand.path}.` },
    };
  }
  if (debugCommand.action === "set") {
    const result = setConfigOverride(debugCommand.path, debugCommand.value);
    if (!result.ok) {
      return {
        shouldContinue: false,
        reply: { text: `⚠️ ${result.error ?? "Invalid override."}` },
      };
    }
    const valueLabel =
      typeof debugCommand.value === "string"
        ? `"${debugCommand.value}"`
        : JSON.stringify(debugCommand.value);
    return {
      shouldContinue: false,
      reply: {
        text: `⚙️ Debug override set: ${debugCommand.path}=${valueLabel ?? "null"}`,
      },
    };
  }

  return null;
};
