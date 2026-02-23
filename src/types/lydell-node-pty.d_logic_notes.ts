/*
 * AUTO ANNOTATION
 * File: src/types/lydell-node-pty.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "@lydell/node-pty" {
  export type PtyExitEvent = { exitCode: number; signal?: number };
  export type PtyListener<T> = (event: T) => void;
  export type PtyHandle = {
    pid: number;
    write: (data: string | Buffer) => void;
    onData: (listener: PtyListener<string>) => void;
    onExit: (listener: PtyListener<PtyExitEvent>) => void;
  };

  export type PtySpawn = (
    file: string,
    args: string[] | string,
    options: {
      name?: string;
      cols?: number;
      rows?: number;
      cwd?: string;
      env?: Record<string, string>;
    },
  ) => PtyHandle;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export const spawn: PtySpawn;
}
