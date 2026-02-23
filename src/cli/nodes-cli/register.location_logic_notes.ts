/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/register.location.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { randomIdempotencyKey } from "../../gateway/call.js";
import { defaultRuntime } from "../../runtime.js";
import { runNodesCommand } from "./cli-utils.js";
import { callGatewayCli, nodesCallOpts, resolveNodeId } from "./rpc.js";
import type { NodesRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerNodesLocationCommands(nodes: Command) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const location = nodes.command("location").description("Fetch location from a paired node");

  nodesCallOpts(
    location
      .command("get")
      .description("Fetch the current location from a node")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--max-age <ms>", "Use cached location newer than this (ms)")
      .option(
        "--accuracy <coarse|balanced|precise>",
        "Desired accuracy (default: balanced/precise depending on node setting)",
      )
      .option("--location-timeout <ms>", "Location fix timeout (ms)", "10000")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000")
      .action(async (opts: NodesRpcOpts) => {
        await runNodesCommand("location get", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const nodeId = await resolveNodeId(opts, String(opts.node ?? ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const maxAgeMs = opts.maxAge ? Number.parseInt(String(opts.maxAge), 10) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const desiredAccuracyRaw =
            typeof opts.accuracy === "string" ? opts.accuracy.trim().toLowerCase() : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const desiredAccuracy =
            desiredAccuracyRaw === "coarse" ||
            desiredAccuracyRaw === "balanced" ||
            desiredAccuracyRaw === "precise"
              ? desiredAccuracyRaw
              : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const timeoutMs = opts.locationTimeout
            ? Number.parseInt(String(opts.locationTimeout), 10)
            : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const invokeTimeoutMs = opts.invokeTimeout
            ? Number.parseInt(String(opts.invokeTimeout), 10)
            : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const invokeParams: Record<string, unknown> = {
            nodeId,
            command: "location.get",
            params: {
              maxAgeMs: Number.isFinite(maxAgeMs) ? maxAgeMs : undefined,
              desiredAccuracy,
              timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : undefined,
            },
            idempotencyKey: randomIdempotencyKey(),
          };
          if (typeof invokeTimeoutMs === "number" && Number.isFinite(invokeTimeoutMs)) {
            invokeParams.timeoutMs = invokeTimeoutMs;
          }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const raw = await callGatewayCli("node.invoke", opts, invokeParams);
          const res = typeof raw === "object" && raw !== null ? (raw as { payload?: unknown }) : {};
          const payload =
            res.payload && typeof res.payload === "object"
              ? (res.payload as Record<string, unknown>)
              : {};

          if (opts.json) {
            defaultRuntime.log(JSON.stringify(payload, null, 2));
            return;
          }

          const lat = payload.lat;
          const lon = payload.lon;
          const acc = payload.accuracyMeters;
          if (typeof lat === "number" && typeof lon === "number") {
            const accText = typeof acc === "number" ? ` ±${acc.toFixed(1)}m` : "";
            defaultRuntime.log(`${lat},${lon}${accText}`);
            return;
          }
          defaultRuntime.log(JSON.stringify(payload));
        });
      }),
    { timeoutMs: 30_000 },
  );
}
