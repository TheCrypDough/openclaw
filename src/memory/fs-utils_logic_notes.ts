/*
 * AUTO ANNOTATION
 * File: src/memory/fs-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Stats } from "node:fs";
import fs from "node:fs/promises";

export type RegularFileStatResult = { missing: true } | { missing: false; stat: Stats };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isFileMissingError(
  err: unknown,
): err is NodeJS.ErrnoException & { code: "ENOENT" } {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as Partial<NodeJS.ErrnoException>).code === "ENOENT",
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function statRegularFile(absPath: string): Promise<RegularFileStatResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let stat: Stats;
  try {
    stat = await fs.lstat(absPath);
  } catch (err) {
    if (isFileMissingError(err)) {
      return { missing: true };
    }
    throw err;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error("path required");
  }
  return { missing: false, stat };
}
