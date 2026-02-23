/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/register.notify.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { randomIdempotencyKey } from "../../gateway/call.js";
import { defaultRuntime } from "../../runtime.js";
import { getNodesTheme, runNodesCommand } from "./cli-utils.js";
import { callGatewayCli, nodesCallOpts, resolveNodeId } from "./rpc.js";
import type { NodesRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerNodesNotifyCommand(nodes: Command) {
  nodesCallOpts(
    nodes
      .command("notify")
      .description("Send a local notification on a node (mac only)")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--title <text>", "Notification title")
      .option("--body <text>", "Notification body")
      .option("--sound <name>", "Notification sound")
      .option("--priority <passive|active|timeSensitive>", "Notification priority")
      .option("--delivery <system|overlay|auto>", "Delivery mode", "system")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 15000)", "15000")
      .action(async (opts: NodesRpcOpts) => {
        await runNodesCommand("notify", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const nodeId = await resolveNodeId(opts, String(opts.node ?? ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const title = String(opts.title ?? "").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const body = String(opts.body ?? "").trim();
          if (!title && !body) {
            throw new Error("missing --title or --body");
          }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const invokeTimeout = opts.invokeTimeout
            ? Number.parseInt(String(opts.invokeTimeout), 10)
            : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const invokeParams: Record<string, unknown> = {
            nodeId,
            command: "system.notify",
            params: {
              title,
              body,
              sound: opts.sound,
              priority: opts.priority,
              delivery: opts.delivery,
            },
            idempotencyKey: String(opts.idempotencyKey ?? randomIdempotencyKey()),
          };
          if (typeof invokeTimeout === "number" && Number.isFinite(invokeTimeout)) {
            invokeParams.timeoutMs = invokeTimeout;
          }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("node.invoke", opts, invokeParams);
          if (opts.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }
          const { ok } = getNodesTheme();
          defaultRuntime.log(ok("notify ok"));
        });
      }),
  );
}
