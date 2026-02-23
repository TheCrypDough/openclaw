/*
 * AUTO ANNOTATION
 * File: src/auto-reply/model-runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SessionEntry } from "../config/sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatProviderModelRef(providerRaw: string, modelRaw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = String(providerRaw ?? "").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = String(modelRaw ?? "").trim();
  if (!provider) {
    return model;
  }
  if (!model) {
    return provider;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefix = `${provider}/`;
  if (model.toLowerCase().startsWith(prefix.toLowerCase())) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalizedModel = model.slice(prefix.length).trim();
    if (normalizedModel) {
      return `${provider}/${normalizedModel}`;
    }
  }
  return `${provider}/${model}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ModelRef = {
  provider: string;
  model: string;
  label: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeModelWithinProvider(provider: string, modelRaw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = String(modelRaw ?? "").trim();
  if (!provider || !model) {
    return model;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefix = `${provider}/`;
  if (model.toLowerCase().startsWith(prefix.toLowerCase())) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const withoutPrefix = model.slice(prefix.length).trim();
    if (withoutPrefix) {
      return withoutPrefix;
    }
  }
  return model;
}

function normalizeModelRef(
  rawModel: string,
  fallbackProvider: string,
  parseEmbeddedProvider = false,
): ModelRef {
  const trimmed = String(rawModel ?? "").trim();
  const slashIndex = parseEmbeddedProvider ? trimmed.indexOf("/") : -1;
  if (slashIndex > 0) {
    const provider = trimmed.slice(0, slashIndex).trim();
    const model = trimmed.slice(slashIndex + 1).trim();
    if (provider && model) {
      return {
        provider,
        model,
        label: `${provider}/${model}`,
      };
    }
  }
  const provider = String(fallbackProvider ?? "").trim();
  const dedupedModel = normalizeModelWithinProvider(provider, trimmed);
  return {
    provider,
    model: dedupedModel || trimmed,
    label: provider ? formatProviderModelRef(provider, dedupedModel || trimmed) : trimmed,
  };
}

export function resolveSelectedAndActiveModel(params: {
  selectedProvider: string;
  selectedModel: string;
  sessionEntry?: Pick<SessionEntry, "modelProvider" | "model">;
}): {
  selected: ModelRef;
  active: ModelRef;
  activeDiffers: boolean;
} {
  const selected = normalizeModelRef(params.selectedModel, params.selectedProvider);
  const runtimeModel = params.sessionEntry?.model?.trim();
  const runtimeProvider = params.sessionEntry?.modelProvider?.trim();

  const active = runtimeModel
    ? normalizeModelRef(runtimeModel, runtimeProvider || selected.provider, !runtimeProvider)
    : selected;
  const activeDiffers = active.provider !== selected.provider || active.model !== selected.model;

  return {
    selected,
    active,
    activeDiffers,
  };
}
