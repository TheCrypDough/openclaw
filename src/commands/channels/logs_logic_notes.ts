/*
 * AUTO ANNOTATION
 * File: src/commands/channels/logs.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { listChannelPlugins } from "../../channels/plugins/index.js";
import { getResolvedLoggerSettings } from "../../logging.js";
import { parseLogLine } from "../../logging/parse-log-line.js";
import { defaultRuntime, type RuntimeEnv } from "../../runtime.js";
import { theme } from "../../terminal/theme.js";

export type ChannelsLogsOptions = {
  channel?: string;
  lines?: string | number;
  json?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type LogLine = ReturnType<typeof parseLogLine>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_LIMIT = 200;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_BYTES = 1_000_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getChannelSet = () =>
  new Set<string>([...listChannelPlugins().map((plugin) => plugin.id), "all"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseChannelFilter(raw?: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim().toLowerCase();
  if (!trimmed) {
    return "all";
  }
  return getChannelSet().has(trimmed) ? trimmed : "all";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function matchesChannel(line: NonNullable<LogLine>, channel: string) {
  if (channel === "all") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const needle = `gateway/channels/${channel}`;
  if (line.subsystem?.includes(needle)) {
    return true;
  }
  if (line.module?.includes(channel)) {
    return true;
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function readTailLines(file: string, limit: number): Promise<string[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stat = await fs.stat(file).catch(() => null);
  if (!stat) {
    return [];
  }
  const size = stat.size;
  const start = Math.max(0, size - MAX_BYTES);
  const handle = await fs.open(file, "r");
  try {
    const length = Math.max(0, size - start);
    if (length === 0) {
      return [];
    }
    const buffer = Buffer.alloc(length);
    const readResult = await handle.read(buffer, 0, length, start);
    const text = buffer.toString("utf8", 0, readResult.bytesRead);
    let lines = text.split("\n");
    if (start > 0) {
      lines = lines.slice(1);
    }
    if (lines.length && lines[lines.length - 1] === "") {
      lines = lines.slice(0, -1);
    }
    if (lines.length > limit) {
      lines = lines.slice(lines.length - limit);
    }
    return lines;
  } finally {
    await handle.close();
  }
}

export async function channelsLogsCommand(
  opts: ChannelsLogsOptions,
  runtime: RuntimeEnv = defaultRuntime,
) {
  const channel = parseChannelFilter(opts.channel);
  const limitRaw = typeof opts.lines === "string" ? Number(opts.lines) : opts.lines;
  const limit =
    typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.floor(limitRaw)
      : DEFAULT_LIMIT;

  const file = getResolvedLoggerSettings().file;
  const rawLines = await readTailLines(file, limit * 4);
  const parsed = rawLines
    .map(parseLogLine)
    .filter((line): line is NonNullable<LogLine> => Boolean(line));
  const filtered = parsed.filter((line) => matchesChannel(line, channel));
  const lines = filtered.slice(Math.max(0, filtered.length - limit));

  if (opts.json) {
    runtime.log(JSON.stringify({ file, channel, lines }, null, 2));
    return;
  }

  runtime.log(theme.info(`Log file: ${file}`));
  if (channel !== "all") {
    runtime.log(theme.info(`Channel: ${channel}`));
  }
  if (lines.length === 0) {
    runtime.log(theme.muted("No matching log lines."));
    return;
  }
  for (const line of lines) {
    const ts = line.time ? `${line.time} ` : "";
    const level = line.level ? `${line.level.toLowerCase()} ` : "";
    runtime.log(`${ts}${level}${line.message}`.trim());
  }
}
