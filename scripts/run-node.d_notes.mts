# AUTOPLACEHOLDER_ANNOTATION: scripts/run-node.d.mts
# Purpose: Operational script for maintenance/build/release/test workflows (run-node.d.mts).
# Area: Repo utility, build, release, and maintenance scripts
# System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
# AUTO SECTION NOTE: run-node.d.mts contains a key declaration/mapping boundary.
export const runNodeWatchedPaths: string[];

# AUTO SECTION NOTE: run-node.d.mts contains a key declaration/mapping boundary.
export function runNodeMain(params?: {
  spawn?: (
    cmd: string,
    args: string[],
    options: unknown,
  ) => {
    on: (
      event: "exit",
      cb: (code: number | null, signal: string | null) => void,
    ) => void | undefined;
  };
  spawnSync?: unknown;
  fs?: unknown;
  stderr?: { write: (value: string) => void };
  execPath?: string;
  cwd?: string;
  args?: string[];
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
}): Promise<number>;
