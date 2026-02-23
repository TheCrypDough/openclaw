/*
 * AUTO ANNOTATION
 * File: extensions/minimax-portal-auth/index.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
  type ProviderAuthResult,
} from "openclaw/plugin-sdk";
import { loginMiniMaxPortalOAuth, type MiniMaxRegion } from "./oauth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PROVIDER_ID = "minimax-portal";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PROVIDER_LABEL = "MiniMax";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MODEL = "MiniMax-M2.5";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_BASE_URL_CN = "https://api.minimaxi.com/anthropic";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_BASE_URL_GLOBAL = "https://api.minimax.io/anthropic";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CONTEXT_WINDOW = 200000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MAX_TOKENS = 8192;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OAUTH_PLACEHOLDER = "minimax-oauth";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getDefaultBaseUrl(region: MiniMaxRegion): string {
  return region === "cn" ? DEFAULT_BASE_URL_CN : DEFAULT_BASE_URL_GLOBAL;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function modelRef(modelId: string): string {
  return `${PROVIDER_ID}/${modelId}`;
}

function buildModelDefinition(params: {
  id: string;
  name: string;
  input: Array<"text" | "image">;
  reasoning?: boolean;
}) {
  return {
    id: params.id,
    name: params.name,
    reasoning: params.reasoning ?? false,
    input: params.input,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: DEFAULT_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MAX_TOKENS,
  };
}

function createOAuthHandler(region: MiniMaxRegion) {
  const defaultBaseUrl = getDefaultBaseUrl(region);
  const regionLabel = region === "cn" ? "CN" : "Global";

  return async (ctx: ProviderAuthContext): Promise<ProviderAuthResult> => {
    const progress = ctx.prompter.progress(`Starting MiniMax OAuth (${regionLabel})…`);
    try {
      const result = await loginMiniMaxPortalOAuth({
        openUrl: ctx.openUrl,
        note: ctx.prompter.note,
        progress,
        region,
      });

      progress.stop("MiniMax OAuth complete");

      if (result.notification_message) {
        await ctx.prompter.note(result.notification_message, "MiniMax OAuth");
      }

      const profileId = `${PROVIDER_ID}:default`;
      const baseUrl = result.resourceUrl || defaultBaseUrl;

      return {
        profiles: [
          {
            profileId,
            credential: {
              type: "oauth" as const,
              provider: PROVIDER_ID,
              access: result.access,
              refresh: result.refresh,
              expires: result.expires,
            },
          },
        ],
        configPatch: {
          models: {
            providers: {
              [PROVIDER_ID]: {
                baseUrl,
                apiKey: OAUTH_PLACEHOLDER,
                api: "anthropic-messages",
                models: [
                  buildModelDefinition({
                    id: "MiniMax-M2.1",
                    name: "MiniMax M2.1",
                    input: ["text"],
                  }),
                  buildModelDefinition({
                    id: "MiniMax-M2.5",
                    name: "MiniMax M2.5",
                    input: ["text"],
                    reasoning: true,
                  }),
                ],
              },
            },
          },
          agents: {
            defaults: {
              models: {
                [modelRef("MiniMax-M2.1")]: { alias: "minimax-m2.1" },
                [modelRef("MiniMax-M2.5")]: { alias: "minimax-m2.5" },
              },
            },
          },
        },
        defaultModel: modelRef(DEFAULT_MODEL),
        notes: [
          "MiniMax OAuth tokens auto-refresh. Re-run login if refresh fails or access is revoked.",
          `Base URL defaults to ${defaultBaseUrl}. Override models.providers.${PROVIDER_ID}.baseUrl if needed.`,
          ...(result.notification_message ? [result.notification_message] : []),
        ],
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      progress.stop(`MiniMax OAuth failed: ${errorMsg}`);
      await ctx.prompter.note(
        "If OAuth fails, verify your MiniMax account has portal access and try again.",
        "MiniMax OAuth",
      );
      throw err;
    }
  };
}

const minimaxPortalPlugin = {
  id: "minimax-portal-auth",
  name: "MiniMax OAuth",
  description: "OAuth flow for MiniMax models",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/minimax",
      aliases: ["minimax"],
      auth: [
        {
          id: "oauth",
          label: "MiniMax OAuth (Global)",
          hint: "Global endpoint - api.minimax.io",
          kind: "device_code",
          run: createOAuthHandler("global"),
        },
        {
          id: "oauth-cn",
          label: "MiniMax OAuth (CN)",
          hint: "CN endpoint - api.minimaxi.com",
          kind: "device_code",
          run: createOAuthHandler("cn"),
        },
      ],
    });
  },
};

export default minimaxPortalPlugin;
