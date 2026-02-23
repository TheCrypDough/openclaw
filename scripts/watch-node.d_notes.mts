# AUTOPLACEHOLDER_ANNOTATION: scripts/watch-node.d.mts
# Purpose: Operational script for maintenance/build/release/test workflows (watch-node.d.mts).
# Area: Repo utility, build, release, and maintenance scripts
# System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
# AUTO SECTION NOTE: watch-node.d.mts contains a key declaration/mapping boundary.
export function runWatchMain(params?: {
  spawn?: (
    cmd: string,
    args: string[],
    options: unknown,
  ) => {
    on: (event: "exit", cb: (code: number | null, signal: string | null) => void) => void;
  };
  process?: NodeJS.Process;
  cwd?: string;
  args?: string[];
  env?: NodeJS.ProcessEnv;
  now?: () => number;
}): Promise<number>;
