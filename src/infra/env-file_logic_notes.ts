/*
 * AUTO ANNOTATION
 * File: src/infra/env-file.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { escapeRegExp, resolveConfigDir } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function upsertSharedEnvVar(params: {
  key: string;
  value: string;
  env?: NodeJS.ProcessEnv;
}): { path: string; updated: boolean; created: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = params.env ?? process.env;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = resolveConfigDir(env);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filepath = path.join(dir, ".env");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = params.key.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = params.value;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let raw = "";
  if (fs.existsSync(filepath)) {
    raw = fs.readFileSync(filepath, "utf8");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = raw.length ? raw.split(/\r?\n/) : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matcher = new RegExp(`^(\\s*(?:export\\s+)?)${escapeRegExp(key)}\\s*=`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let updated = false;
  let replaced = false;

  const nextLines = lines.map((line) => {
    const match = line.match(matcher);
    if (!match) {
      return line;
    }
    replaced = true;
    const prefix = match[1] ?? "";
    const next = `${prefix}${key}=${value}`;
    if (next !== line) {
      updated = true;
    }
    return next;
  });

  if (!replaced) {
    nextLines.push(`${key}=${value}`);
    updated = true;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  const output = `${nextLines.join("\n")}\n`;
  fs.writeFileSync(filepath, output, "utf8");
  fs.chmodSync(filepath, 0o600);

  return { path: filepath, updated, created: !raw };
}
