/*
 * AUTO ANNOTATION
 * File: src/infra/is-main.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type IsMainModuleOptions = {
  currentFile: string;
  argv?: string[];
  env?: NodeJS.ProcessEnv;
  cwd?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizePathCandidate(candidate: string | undefined, cwd: string): string | undefined {
  if (!candidate) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = path.resolve(cwd, candidate);
  try {
    return fs.realpathSync.native(resolved);
  } catch {
    return resolved;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isMainModule({
  currentFile,
  argv = process.argv,
  env = process.env,
  cwd = process.cwd(),
}: IsMainModuleOptions): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedCurrent = normalizePathCandidate(currentFile, cwd);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedArgv1 = normalizePathCandidate(argv[1], cwd);

  if (normalizedCurrent && normalizedArgv1 && normalizedCurrent === normalizedArgv1) {
    return true;
  }

  // PM2 runs the script via an internal wrapper; `argv[1]` points at the wrapper.
  // PM2 exposes the actual script path in `pm_exec_path`.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedPmExecPath = normalizePathCandidate(env.pm_exec_path, cwd);
  if (normalizedCurrent && normalizedPmExecPath && normalizedCurrent === normalizedPmExecPath) {
    return true;
  }

  // Fallback: basename match (relative paths, symlinked bins).
  if (
    normalizedCurrent &&
    normalizedArgv1 &&
    path.basename(normalizedCurrent) === path.basename(normalizedArgv1)
  ) {
    return true;
  }

  return false;
}
