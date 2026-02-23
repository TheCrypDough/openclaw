/*
 * AUTO ANNOTATION
 * File: src/test-utils/model-auth-mock.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ModelAuthMockModule = {
  resolveApiKeyForProvider: (...args: unknown[]) => unknown;
  requireApiKey: (auth: { apiKey?: string; mode?: string }, provider: string) => string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createModelAuthMockModule(): ModelAuthMockModule {
  return {
    resolveApiKeyForProvider: vi.fn() as (...args: unknown[]) => unknown,
    requireApiKey: (auth: { apiKey?: string; mode?: string }, provider: string) => {
      if (auth?.apiKey) {
        return auth.apiKey;
      }
      throw new Error(`No API key resolved for provider "${provider}" (auth mode: ${auth?.mode}).`);
    },
  };
}
