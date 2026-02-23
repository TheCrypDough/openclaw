/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.oauth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { loginChutes } from "./chutes-oauth.js";
import { isRemoteEnvironment } from "./oauth-env.js";
import { createVpsAwareOAuthHandlers } from "./oauth-flow.js";
import { applyAuthProfileConfig, writeOAuthCredentials } from "./onboard-auth.js";
import { openUrl } from "./onboard-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceOAuth(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice === "chutes") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let nextConfig = params.config;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const isRemote = isRemoteEnvironment();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const redirectUri =
      process.env.CHUTES_OAUTH_REDIRECT_URI?.trim() || "http://127.0.0.1:1456/oauth-callback";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const scopes = process.env.CHUTES_OAUTH_SCOPES?.trim() || "openid profile chutes:invoke";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const clientId =
      process.env.CHUTES_CLIENT_ID?.trim() ||
      String(
        await params.prompter.text({
          message: "Enter Chutes OAuth client id",
          placeholder: "cid_xxx",
          validate: (value) => (value?.trim() ? undefined : "Required"),
        }),
      ).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const clientSecret = process.env.CHUTES_CLIENT_SECRET?.trim() || undefined;

    await params.prompter.note(
      isRemote
        ? [
            "You are running in a remote/VPS environment.",
            "A URL will be shown for you to open in your LOCAL browser.",
            "After signing in, paste the redirect URL back here.",
            "",
            `Redirect URI: ${redirectUri}`,
          ].join("\n")
        : [
            "Browser will open for Chutes authentication.",
            "If the callback doesn't auto-complete, paste the redirect URL.",
            "",
            `Redirect URI: ${redirectUri}`,
          ].join("\n"),
      "Chutes OAuth",
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spin = params.prompter.progress("Starting OAuth flow…");
    try {
      const { onAuth, onPrompt } = createVpsAwareOAuthHandlers({
        isRemote,
        prompter: params.prompter,
        runtime: params.runtime,
        spin,
        openUrl,
        localBrowserMessage: "Complete sign-in in browser…",
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const creds = await loginChutes({
        app: {
          clientId,
          clientSecret,
          redirectUri,
          scopes: scopes.split(/\s+/).filter(Boolean),
        },
        manual: isRemote,
        onAuth,
        onPrompt,
        onProgress: (msg) => spin.update(msg),
      });

      spin.stop("Chutes OAuth complete");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const profileId = await writeOAuthCredentials("chutes", creds, params.agentDir);
      nextConfig = applyAuthProfileConfig(nextConfig, {
        profileId,
        provider: "chutes",
        mode: "oauth",
      });
    } catch (err) {
      spin.stop("Chutes OAuth failed");
      params.runtime.error(String(err));
      await params.prompter.note(
        [
          "Trouble with OAuth?",
          "Verify CHUTES_CLIENT_ID (and CHUTES_CLIENT_SECRET if required).",
          `Verify the OAuth app redirect URI includes: ${redirectUri}`,
          "Chutes docs: https://chutes.ai/docs/sign-in-with-chutes/overview",
        ].join("\n"),
        "OAuth help",
      );
    }
    return { config: nextConfig };
  }

  return null;
}
