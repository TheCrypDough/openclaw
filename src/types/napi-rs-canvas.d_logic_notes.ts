/*
 * AUTO ANNOTATION
 * File: src/types/napi-rs-canvas.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "@napi-rs/canvas" {
  export type Canvas = {
    toBuffer(type?: string): Buffer;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function createCanvas(width: number, height: number): Canvas;
}
