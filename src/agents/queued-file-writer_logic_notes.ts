/*
 * AUTO ANNOTATION
 * File: src/agents/queued-file-writer.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";

export type QueuedFileWriter = {
  filePath: string;
  write: (line: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getQueuedFileWriter(
  writers: Map<string, QueuedFileWriter>,
  filePath: string,
): QueuedFileWriter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = writers.get(filePath);
  if (existing) {
    return existing;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.dirname(filePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ready = fs.mkdir(dir, { recursive: true }).catch(() => undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let queue = Promise.resolve();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const writer: QueuedFileWriter = {
    filePath,
    write: (line: string) => {
      queue = queue
        .then(() => ready)
        .then(() => fs.appendFile(filePath, line, "utf8"))
        .catch(() => undefined);
    },
  };

  writers.set(filePath, writer);
  return writer;
}
