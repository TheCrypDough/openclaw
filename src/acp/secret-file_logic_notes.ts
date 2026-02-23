/*
 * AUTO ANNOTATION
 * File: src/acp/secret-file.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import { resolveUserPath } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readSecretFromFile(filePath: string, label: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedPath = resolveUserPath(filePath.trim());
  if (!resolvedPath) {
    throw new Error(`${label} file path is empty.`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let raw = "";
  try {
    raw = fs.readFileSync(resolvedPath, "utf8");
  } catch (err) {
    throw new Error(`Failed to read ${label} file at ${resolvedPath}: ${String(err)}`, {
      cause: err,
    });
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const secret = raw.trim();
  if (!secret) {
    throw new Error(`${label} file at ${resolvedPath} is empty.`);
  }
  return secret;
}
