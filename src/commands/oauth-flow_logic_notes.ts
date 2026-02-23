/*
 * AUTO ANNOTATION
 * File: src/commands/oauth-flow.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type OAuthPrompt = { message: string; placeholder?: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const validateRequiredInput = (value: string) => (value.trim().length > 0 ? undefined : "Required");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createVpsAwareOAuthHandlers(params: {
  isRemote: boolean;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  spin: ReturnType<WizardPrompter["progress"]>;
  openUrl: (url: string) => Promise<unknown>;
  localBrowserMessage: string;
  manualPromptMessage?: string;
}): {
  onAuth: (event: { url: string }) => Promise<void>;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const manualPromptMessage = params.manualPromptMessage ?? "Paste the redirect URL";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let manualCodePromise: Promise<string> | undefined;

  return {
    onAuth: async ({ url }) => {
      if (params.isRemote) {
        params.spin.stop("OAuth URL ready");
        params.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${url}\n`);
        manualCodePromise = params.prompter
          .text({
            message: manualPromptMessage,
            validate: validateRequiredInput,
          })
          .then((value) => String(value));
        return;
      }

      params.spin.update(params.localBrowserMessage);
      await params.openUrl(url);
      params.runtime.log(`Open: ${url}`);
    },
    onPrompt: async (prompt) => {
      if (manualCodePromise) {
        return manualCodePromise;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const code = await params.prompter.text({
        message: prompt.message,
        placeholder: prompt.placeholder,
        validate: validateRequiredInput,
      });
      return String(code);
    },
  };
}
