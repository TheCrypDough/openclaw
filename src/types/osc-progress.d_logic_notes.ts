/*
 * AUTO ANNOTATION
 * File: src/types/osc-progress.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "osc-progress" {
  export type OscProgressController = {
    setIndeterminate: (label: string) => void;
    setPercent: (label: string, percent: number) => void;
    clear: () => void;
    done?: () => void;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function createOscProgressController(params: {
    env: NodeJS.ProcessEnv;
    isTty: boolean;
    write: (chunk: string) => void;
  }): OscProgressController;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function supportsOscProgress(env: NodeJS.ProcessEnv, isTty: boolean): boolean;
}
