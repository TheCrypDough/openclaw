/*
 * AUTO ANNOTATION
 * File: src/memory/sqlite.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createRequire } from "node:module";
import { installProcessWarningFilter } from "../infra/warning-filter.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const require = createRequire(import.meta.url);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requireNodeSqlite(): typeof import("node:sqlite") {
  installProcessWarningFilter();
  try {
    return require("node:sqlite") as typeof import("node:sqlite");
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = err instanceof Error ? err.message : String(err);
    // Node distributions can ship without the experimental builtin SQLite module.
    // Surface an actionable error instead of the generic "unknown builtin module".
    throw new Error(
      `SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`,
      { cause: err },
    );
  }
}
