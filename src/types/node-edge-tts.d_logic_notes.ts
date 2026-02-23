/*
 * AUTO ANNOTATION
 * File: src/types/node-edge-tts.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "node-edge-tts" {
  export type EdgeTTSOptions = {
    voice?: string;
    lang?: string;
    outputFormat?: string;
    saveSubtitles?: boolean;
    proxy?: string;
    rate?: string;
    pitch?: string;
    volume?: string;
    timeout?: number;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export class EdgeTTS {
    constructor(options?: EdgeTTSOptions);
    ttsPromise(text: string, outputPath: string): Promise<void>;
  }
}
