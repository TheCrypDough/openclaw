/*
 * AUTO ANNOTATION
 * File: src/config/includes-scan.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import * as fs from "node:fs/promises";
import path from "node:path";
import JSON5 from "json5";
import { INCLUDE_KEY, MAX_INCLUDE_DEPTH } from "./includes.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listDirectIncludes(parsed: unknown): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const visit = (value: unknown) => {
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }
    if (typeof value !== "object") {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rec = value as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const includeVal = rec[INCLUDE_KEY];
    if (typeof includeVal === "string") {
      out.push(includeVal);
    } else if (Array.isArray(includeVal)) {
      for (const item of includeVal) {
        if (typeof item === "string") {
          out.push(item);
        }
      }
    }
    for (const v of Object.values(rec)) {
      visit(v);
    }
  };
  visit(parsed);
  return out;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveIncludePath(baseConfigPath: string, includePath: string): string {
  return path.normalize(
    path.isAbsolute(includePath)
      ? includePath
      : path.resolve(path.dirname(baseConfigPath), includePath),
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function collectIncludePathsRecursive(params: {
  configPath: string;
  parsed: unknown;
}): Promise<string[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const visited = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const walk = async (basePath: string, parsed: unknown, depth: number): Promise<void> => {
    if (depth > MAX_INCLUDE_DEPTH) {
      return;
    }
    for (const raw of listDirectIncludes(parsed)) {
      const resolved = resolveIncludePath(basePath, raw);
      if (visited.has(resolved)) {
        continue;
      }
      visited.add(resolved);
      result.push(resolved);

      const rawText = await fs.readFile(resolved, "utf-8").catch(() => null);
      if (!rawText) {
        continue;
      }
      const nestedParsed = (() => {
        try {
          return JSON5.parse(rawText);
        } catch {
          return null;
        }
      })();
      if (nestedParsed) {
        // eslint-disable-next-line no-await-in-loop
        await walk(resolved, nestedParsed, depth + 1);
      }
    }
  };

  await walk(params.configPath, params.parsed, 0);
  return result;
}
