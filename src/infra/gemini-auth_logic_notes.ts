/*
 * AUTO ANNOTATION
 * File: src/infra/gemini-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Shared Gemini authentication utilities.
 *
 * Supports both traditional API keys and OAuth JSON format.
 */

/**
 * Parse Gemini API key and return appropriate auth headers.
 *
 * OAuth format: `{"token": "...", "projectId": "..."}`
 *
 * @param apiKey - Either a traditional API key string or OAuth JSON
 * @returns Headers object with appropriate authentication
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseGeminiAuth(apiKey: string): { headers: Record<string, string> } {
  // Try parsing as OAuth JSON format
  if (apiKey.startsWith("{")) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parsed = JSON.parse(apiKey) as { token?: string; projectId?: string };
      if (typeof parsed.token === "string" && parsed.token) {
        return {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
            "Content-Type": "application/json",
          },
        };
      }
    } catch {
      // Parse failed, fallback to API key mode
    }
  }

  // Default: traditional API key
  return {
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };
}
