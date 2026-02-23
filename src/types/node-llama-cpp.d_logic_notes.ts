/*
 * AUTO ANNOTATION
 * File: src/types/node-llama-cpp.d.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
declare module "node-llama-cpp" {
  export enum LlamaLogLevel {
    error = 0,
  }

  export type LlamaEmbedding = { vector: Float32Array | number[] };

  export type LlamaEmbeddingContext = {
    getEmbeddingFor: (text: string) => Promise<LlamaEmbedding>;
  };

  export type LlamaModel = {
    createEmbeddingContext: () => Promise<LlamaEmbeddingContext>;
  };

  export type Llama = {
    loadModel: (params: { modelPath: string }) => Promise<LlamaModel>;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function getLlama(params: { logLevel: LlamaLogLevel }): Promise<Llama>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  export function resolveModelFile(modelPath: string, cacheDir?: string): Promise<string>;
}
