/*
 * AUTO ANNOTATION
 * File: src/cli/system-cli.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { danger } from "../globals.js";
import { defaultRuntime } from "../runtime.js";
import { formatDocsLink } from "../terminal/links.js";
import { theme } from "../terminal/theme.js";
import type { GatewayRpcOpts } from "./gateway-rpc.js";
import { addGatewayClientOptions, callGatewayFromCli } from "./gateway-rpc.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SystemEventOpts = GatewayRpcOpts & { text?: string; mode?: string; json?: boolean };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SystemGatewayOpts = GatewayRpcOpts & { json?: boolean };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const normalizeWakeMode = (raw: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = typeof raw === "string" ? raw.trim() : "";
  if (!mode) {
    return "next-heartbeat" as const;
  }
  if (mode === "now" || mode === "next-heartbeat") {
    return mode;
  }
  throw new Error("--mode must be now or next-heartbeat");
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function runSystemGatewayCommand(
  opts: SystemGatewayOpts,
  action: () => Promise<unknown>,
  successText?: string,
): Promise<void> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await action();
    if (opts.json || successText === undefined) {
      defaultRuntime.log(JSON.stringify(result, null, 2));
    } else {
      defaultRuntime.log(successText);
    }
  } catch (err) {
    defaultRuntime.error(danger(String(err)));
    defaultRuntime.exit(1);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerSystemCli(program: Command) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const system = program
    .command("system")
    .description("System tools (events, heartbeat, presence)")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.openclaw.ai/cli/system")}\n`,
    );

  addGatewayClientOptions(
    system
      .command("event")
      .description("Enqueue a system event and optionally trigger a heartbeat")
      .requiredOption("--text <text>", "System event text")
      .option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat")
      .option("--json", "Output JSON", false),
  ).action(async (opts: SystemEventOpts) => {
    await runSystemGatewayCommand(
      opts,
      async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const text = typeof opts.text === "string" ? opts.text.trim() : "";
        if (!text) {
          throw new Error("--text is required");
        }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const mode = normalizeWakeMode(opts.mode);
        return await callGatewayFromCli("wake", opts, { mode, text }, { expectFinal: false });
      },
      "ok",
    );
  });

  const heartbeat = system.command("heartbeat").description("Heartbeat controls");

  addGatewayClientOptions(
    heartbeat
      .command("last")
      .description("Show the last heartbeat event")
      .option("--json", "Output JSON", false),
  ).action(async (opts: SystemGatewayOpts) => {
    await runSystemGatewayCommand(opts, async () => {
      return await callGatewayFromCli("last-heartbeat", opts, undefined, {
        expectFinal: false,
      });
    });
  });

  addGatewayClientOptions(
    heartbeat
      .command("enable")
      .description("Enable heartbeats")
      .option("--json", "Output JSON", false),
  ).action(async (opts: SystemGatewayOpts) => {
    await runSystemGatewayCommand(opts, async () => {
      return await callGatewayFromCli(
        "set-heartbeats",
        opts,
        { enabled: true },
        { expectFinal: false },
      );
    });
  });

  addGatewayClientOptions(
    heartbeat
      .command("disable")
      .description("Disable heartbeats")
      .option("--json", "Output JSON", false),
  ).action(async (opts: SystemGatewayOpts) => {
    await runSystemGatewayCommand(opts, async () => {
      return await callGatewayFromCli(
        "set-heartbeats",
        opts,
        { enabled: false },
        { expectFinal: false },
      );
    });
  });

  addGatewayClientOptions(
    system
      .command("presence")
      .description("List system presence entries")
      .option("--json", "Output JSON", false),
  ).action(async (opts: SystemGatewayOpts) => {
    await runSystemGatewayCommand(opts, async () => {
      return await callGatewayFromCli("system-presence", opts, undefined, {
        expectFinal: false,
      });
    });
  });
}
