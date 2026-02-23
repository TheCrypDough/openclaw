/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-remote-client.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { requireApiKey, resolveApiKeyForProvider } from "../agents/model-auth.js";
import type { EmbeddingProviderOptions } from "./embeddings.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RemoteEmbeddingProviderId = "openai" | "voyage";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveRemoteEmbeddingBearerClient(params: {
  provider: RemoteEmbeddingProviderId;
  options: EmbeddingProviderOptions;
  defaultBaseUrl: string;
}): Promise<{ baseUrl: string; headers: Record<string, string> }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remote = params.options.remote;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remoteApiKey = remote?.apiKey?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remoteBaseUrl = remote?.baseUrl?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const providerConfig = params.options.config.models?.providers?.[params.provider];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const apiKey = remoteApiKey
    ? remoteApiKey
    : requireApiKey(
        await resolveApiKeyForProvider({
          provider: params.provider,
          cfg: params.options.config,
          agentDir: params.options.agentDir,
        }),
        params.provider,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = remoteBaseUrl || providerConfig?.baseUrl?.trim() || params.defaultBaseUrl;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headerOverrides = Object.assign({}, providerConfig?.headers, remote?.headers);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...headerOverrides,
  };
  return { baseUrl, headers };
}
