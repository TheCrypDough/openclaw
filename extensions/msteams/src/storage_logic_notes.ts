/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/storage.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { getMSTeamsRuntime } from "./runtime.js";

export type MSTeamsStorePathOptions = {
  env?: NodeJS.ProcessEnv;
  homedir?: () => string;
  stateDir?: string;
  storePath?: string;
  filename: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMSTeamsStorePath(params: MSTeamsStorePathOptions): string {
  if (params.storePath) {
    return params.storePath;
  }
  if (params.stateDir) {
    return path.join(params.stateDir, params.filename);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = params.env ?? process.env;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = params.homedir
    ? getMSTeamsRuntime().state.resolveStateDir(env, params.homedir)
    : getMSTeamsRuntime().state.resolveStateDir(env);
  return path.join(stateDir, params.filename);
}
