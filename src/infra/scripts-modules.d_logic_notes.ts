/*
 * AUTO ANNOTATION
 * File: src/infra/scripts-modules.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "../../scripts/run-node.mjs" {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export const runNodeWatchedPaths: string[];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
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
}

declare module "../../scripts/watch-node.mjs" {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function runWatchMain(params?: {
    spawn?: (
      cmd: string,
      args: string[],
      options: unknown,
    ) => { on: (event: "exit", cb: (code: number | null, signal: string | null) => void) => void };
    process?: NodeJS.Process;
    cwd?: string;
    args?: string[];
    env?: NodeJS.ProcessEnv;
    now?: () => number;
  }): Promise<number>;
}
