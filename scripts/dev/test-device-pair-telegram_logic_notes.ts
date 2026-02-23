/*
 * AUTO ANNOTATION
 * File: scripts/dev/test-device-pair-telegram.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (test-device-pair-telegram.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../../src/config/config.js";
import { matchPluginCommand, executePluginCommand } from "../../src/plugins/commands.js";
import { loadOpenClawPlugins } from "../../src/plugins/loader.js";
import { sendMessageTelegram } from "../../src/telegram/send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const args = process.argv.slice(2);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getArg = (flag: string, short?: string) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  if (short) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sidx = args.indexOf(short);
    if (sidx !== -1 && sidx + 1 < args.length) {
      return args[sidx + 1];
    }
  }
  return undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const chatId = getArg("--chat", "-c");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const accountId = getArg("--account", "-a");
if (!chatId) {
  // eslint-disable-next-line no-console
  console.error(
    "Usage: bun scripts/dev/test-device-pair-telegram.ts --chat <telegram-chat-id> [--account <accountId>]",
  );
  process.exit(1);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const cfg = loadConfig();
loadOpenClawPlugins({ config: cfg });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const match = matchPluginCommand("/pair");
if (!match) {
  // eslint-disable-next-line no-console
  console.error("/pair plugin command not registered.");
  process.exit(1);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const result = await executePluginCommand({
  command: match.command,
  args: match.args,
  senderId: chatId,
  channel: "telegram",
  channelId: "telegram",
  isAuthorizedSender: true,
  commandBody: "/pair",
  config: cfg,
  from: `telegram:${chatId}`,
  to: `telegram:${chatId}`,
  accountId: accountId,
});

if (result.text) {
  await sendMessageTelegram(chatId, result.text, {
    accountId: accountId,
  });
}

// eslint-disable-next-line no-console
console.log("Sent split /pair messages to", chatId, accountId ? `(${accountId})` : "");
