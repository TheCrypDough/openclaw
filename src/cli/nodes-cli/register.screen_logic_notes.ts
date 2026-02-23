/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/register.screen.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { defaultRuntime } from "../../runtime.js";
import { shortenHomePath } from "../../utils.js";
import {
  parseScreenRecordPayload,
  screenRecordTempPath,
  writeScreenRecordToFile,
} from "../nodes-screen.js";
import { parseDurationMs } from "../parse-duration.js";
import { runNodesCommand } from "./cli-utils.js";
import { buildNodeInvokeParams, callGatewayCli, nodesCallOpts, resolveNodeId } from "./rpc.js";
import type { NodesRpcOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerNodesScreenCommands(nodes: Command) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const screen = nodes
    .command("screen")
    .description("Capture screen recordings from a paired node");

  nodesCallOpts(
    screen
      .command("record")
      .description("Capture a short screen recording from a node (prints MEDIA:<path>)")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--screen <index>", "Screen index (0 = primary)", "0")
      .option("--duration <ms|10s>", "Clip duration (ms or 10s)", "10000")
      .option("--fps <fps>", "Frames per second", "10")
      .option("--no-audio", "Disable microphone audio capture")
      .option("--out <path>", "Output path")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 120000)", "120000")
      .action(async (opts: NodesRpcOpts & { out?: string }) => {
        await runNodesCommand("screen record", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const nodeId = await resolveNodeId(opts, String(opts.node ?? ""));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const durationMs = parseDurationMs(opts.duration ?? "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const screenIndex = Number.parseInt(String(opts.screen ?? "0"), 10);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const fps = Number.parseFloat(String(opts.fps ?? "10"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const timeoutMs = opts.invokeTimeout
            ? Number.parseInt(String(opts.invokeTimeout), 10)
            : undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const invokeParams = buildNodeInvokeParams({
            nodeId,
            command: "screen.record",
            params: {
              durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
              screenIndex: Number.isFinite(screenIndex) ? screenIndex : undefined,
              fps: Number.isFinite(fps) ? fps : undefined,
              format: "mp4",
              includeAudio: opts.audio !== false,
            },
            timeoutMs,
          });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const raw = await callGatewayCli("node.invoke", opts, invokeParams);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const res = typeof raw === "object" && raw !== null ? (raw as { payload?: unknown }) : {};
          const parsed = parseScreenRecordPayload(res.payload);
          const filePath = opts.out ?? screenRecordTempPath({ ext: parsed.format || "mp4" });
          const written = await writeScreenRecordToFile(filePath, parsed.base64);

          if (opts.json) {
            defaultRuntime.log(
              JSON.stringify(
                {
                  file: {
                    path: written.path,
                    durationMs: parsed.durationMs,
                    fps: parsed.fps,
                    screenIndex: parsed.screenIndex,
                    hasAudio: parsed.hasAudio,
                  },
                },
                null,
                2,
              ),
            );
            return;
          }
          defaultRuntime.log(`MEDIA:${shortenHomePath(written.path)}`);
        });
      }),
    { timeoutMs: 180_000 },
  );
}
