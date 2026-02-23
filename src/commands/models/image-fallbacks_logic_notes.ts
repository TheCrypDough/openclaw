/*
 * AUTO ANNOTATION
 * File: src/commands/models/image-fallbacks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "../../runtime.js";
import {
  addFallbackCommand,
  clearFallbacksCommand,
  listFallbacksCommand,
  removeFallbackCommand,
} from "./fallbacks-shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsImageFallbacksListCommand(
  opts: { json?: boolean; plain?: boolean },
  runtime: RuntimeEnv,
) {
  return await listFallbacksCommand({ label: "Image fallbacks", key: "imageModel" }, opts, runtime);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsImageFallbacksAddCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await addFallbackCommand(
    { label: "Image fallbacks", key: "imageModel", logPrefix: "Image fallbacks" },
    modelRaw,
    runtime,
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsImageFallbacksRemoveCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await removeFallbackCommand(
    {
      label: "Image fallbacks",
      key: "imageModel",
      notFoundLabel: "Image fallback",
      logPrefix: "Image fallbacks",
    },
    modelRaw,
    runtime,
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function modelsImageFallbacksClearCommand(runtime: RuntimeEnv) {
  return await clearFallbacksCommand(
    { key: "imageModel", clearedMessage: "Image fallback list cleared." },
    runtime,
  );
}
