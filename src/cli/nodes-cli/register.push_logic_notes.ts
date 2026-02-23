/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/register.push.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { defaultRuntime } from "../../runtime.js";
import { getNodesTheme, runNodesCommand } from "./cli-utils.js";
import { callGatewayCli, nodesCallOpts, resolveNodeId } from "./rpc.js";
import type { NodesRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type NodesPushOpts = NodesRpcOpts & {
  node?: string;
  title?: string;
  body?: string;
  environment?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeEnvironment(value: unknown): "sandbox" | "production" | null {
  if (typeof value !== "string") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim().toLowerCase();
  if (normalized === "sandbox" || normalized === "production") {
    return normalized;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerNodesPushCommand(nodes: Command) {
  nodesCallOpts(
    nodes
      .command("push")
      .description("Send an APNs test push to an iOS node")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--title <text>", "Push title", "OpenClaw")
      .option("--body <text>", "Push body")
      .option("--environment <sandbox|production>", "Override APNs environment")
      .action(async (opts: NodesPushOpts) => {
        await runNodesCommand("push", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const nodeId = await resolveNodeId(opts, String(opts.node ?? ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const title = String(opts.title ?? "").trim() || "OpenClaw";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const body = String(opts.body ?? "").trim() || `Push test for node ${nodeId}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const environment = normalizeEnvironment(opts.environment);
          if (opts.environment && !environment) {
            throw new Error("invalid --environment (use sandbox|production)");
          }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const params: Record<string, unknown> = {
            nodeId,
            title,
            body,
          };
          if (environment) {
            params.environment = environment;
          }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const result = await callGatewayCli("push.test", opts, params);
          if (opts.json) {
            defaultRuntime.log(JSON.stringify(result, null, 2));
            return;
          }

          const parsed =
            typeof result === "object" && result !== null
              ? (result as {
                  ok?: unknown;
                  status?: unknown;
                  reason?: unknown;
                  environment?: unknown;
                })
              : {};
          const ok = parsed.ok === true;
          const status = typeof parsed.status === "number" ? parsed.status : 0;
          const reason =
            typeof parsed.reason === "string" && parsed.reason.trim().length > 0
              ? parsed.reason.trim()
              : undefined;
          const env =
            typeof parsed.environment === "string" && parsed.environment.trim().length > 0
              ? parsed.environment.trim()
              : "unknown";
          const { ok: okLabel, error: errorLabel } = getNodesTheme();
          const label = ok ? okLabel : errorLabel;
          defaultRuntime.log(label(`push.test status=${status} ok=${ok} env=${env}`));
          if (reason) {
            defaultRuntime.log(`reason: ${reason}`);
          }
        });
      }),
    { timeoutMs: 25_000 },
  );
}
