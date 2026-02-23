/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/register.pairing.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { defaultRuntime } from "../../runtime.js";
import { getNodesTheme, runNodesCommand } from "./cli-utils.js";
import { parsePairingList } from "./format.js";
import { renderPendingPairingRequestsTable } from "./pairing-render.js";
import { callGatewayCli, nodesCallOpts, resolveNodeId } from "./rpc.js";
import type { NodesRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerNodesPairingCommands(nodes: Command) {
  nodesCallOpts(
    nodes
      .command("pending")
      .description("List pending pairing requests")
      .action(async (opts: NodesRpcOpts) => {
        await runNodesCommand("pending", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("node.pair.list", opts, {});
          const { pending } = parsePairingList(result);
          if (opts.json) {
            defaultRuntime.log(JSON.stringify(pending, null, 2));
            return;
          }
          if (pending.length === 0) {
            const { muted } = getNodesTheme();
            defaultRuntime.log(muted("No pending pairing requests."));
            return;
          }
          const { heading, warn, muted } = getNodesTheme();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const tableWidth = Math.max(60, (process.stdout.columns ?? 120) - 1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const rendered = renderPendingPairingRequestsTable({
            pending,
            now,
            tableWidth,
            theme: { heading, warn, muted },
          });
          defaultRuntime.log(rendered.heading);
          defaultRuntime.log(rendered.table);
        });
      }),
  );

  nodesCallOpts(
    nodes
      .command("approve")
      .description("Approve a pending pairing request")
      .argument("<requestId>", "Pending request id")
      .action(async (requestId: string, opts: NodesRpcOpts) => {
        await runNodesCommand("approve", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("node.pair.approve", opts, {
            requestId,
          });
          defaultRuntime.log(JSON.stringify(result, null, 2));
        });
      }),
  );

  nodesCallOpts(
    nodes
      .command("reject")
      .description("Reject a pending pairing request")
      .argument("<requestId>", "Pending request id")
      .action(async (requestId: string, opts: NodesRpcOpts) => {
        await runNodesCommand("reject", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("node.pair.reject", opts, {
            requestId,
          });
          defaultRuntime.log(JSON.stringify(result, null, 2));
        });
      }),
  );

  nodesCallOpts(
    nodes
      .command("rename")
      .description("Rename a paired node (display name override)")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .requiredOption("--name <displayName>", "New display name")
      .action(async (opts: NodesRpcOpts) => {
        await runNodesCommand("rename", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const nodeId = await resolveNodeId(opts, String(opts.node ?? ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const name = String(opts.name ?? "").trim();
          if (!nodeId || !name) {
            defaultRuntime.error("--node and --name required");
            defaultRuntime.exit(1);
            return;
          }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("node.rename", opts, {
            nodeId,
            displayName: name,
          });
          if (opts.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }
          const { ok } = getNodesTheme();
          defaultRuntime.log(ok(`node rename ok: ${nodeId} -> ${name}`));
        });
      }),
  );
}
