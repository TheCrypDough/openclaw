/*
 * AUTO ANNOTATION
 * File: src/agents/api-key-rotation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatErrorMessage } from "../infra/errors.js";
import { collectProviderApiKeys, isApiKeyRateLimitError } from "./live-auth-keys.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ApiKeyRetryParams = {
  apiKey: string;
  error: unknown;
  attempt: number;
};

type ExecuteWithApiKeyRotationOptions<T> = {
  provider: string;
  apiKeys: string[];
  execute: (apiKey: string) => Promise<T>;
  shouldRetry?: (params: ApiKeyRetryParams & { message: string }) => boolean;
  onRetry?: (params: ApiKeyRetryParams & { message: string }) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function dedupeApiKeys(raw: string[]): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keys: string[] = [];
  for (const value of raw) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const apiKey = value.trim();
    if (!apiKey || seen.has(apiKey)) {
      continue;
    }
    seen.add(apiKey);
    keys.push(apiKey);
  }
  return keys;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectProviderApiKeysForExecution(params: {
  provider: string;
  primaryApiKey?: string;
}): string[] {
  const { primaryApiKey, provider } = params;
  return dedupeApiKeys([primaryApiKey?.trim() ?? "", ...collectProviderApiKeys(provider)]);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function executeWithApiKeyRotation<T>(
  params: ExecuteWithApiKeyRotationOptions<T>,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keys = dedupeApiKeys(params.apiKeys);
  if (keys.length === 0) {
    throw new Error(`No API keys configured for provider "${params.provider}".`);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let lastError: unknown;
  for (let attempt = 0; attempt < keys.length; attempt += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const apiKey = keys[attempt];
    try {
      return await params.execute(apiKey);
    } catch (error) {
      lastError = error;
      const message = formatErrorMessage(error);
      const retryable = params.shouldRetry
        ? params.shouldRetry({ apiKey, error, attempt, message })
        : isApiKeyRateLimitError(message);

      if (!retryable || attempt + 1 >= keys.length) {
        break;
      }

      params.onRetry?.({ apiKey, error, attempt, message });
    }
  }

  if (lastError === undefined) {
    throw new Error(`Failed to run API request for ${params.provider}.`);
  }
  throw lastError;
}
