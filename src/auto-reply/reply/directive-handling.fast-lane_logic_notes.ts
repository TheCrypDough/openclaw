/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/directive-handling.fast-lane.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyPayload } from "../types.js";
import { handleDirectiveOnly } from "./directive-handling.impl.js";
import { resolveCurrentDirectiveLevels } from "./directive-handling.levels.js";
import type { ApplyInlineDirectivesFastLaneParams } from "./directive-handling.params.js";
import { isDirectiveOnly } from "./directive-handling.parse.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyInlineDirectivesFastLane(
  params: ApplyInlineDirectivesFastLaneParams,
): Promise<{ directiveAck?: ReplyPayload; provider: string; model: string }> {
  const {
    directives,
    commandAuthorized,
    ctx,
    cfg,
    agentId,
    isGroup,
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    elevatedEnabled,
    elevatedAllowed,
    elevatedFailures,
    messageProviderKey,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelKeys,
    allowedModelCatalog,
    resetModelOverride,
    formatModelSwitchEvent,
    modelState,
  } = params;

  let { provider, model } = params;
  if (
    !commandAuthorized ||
    isDirectiveOnly({
      directives,
      cleanedBody: directives.cleaned,
      ctx,
      cfg,
      agentId,
      isGroup,
    })
  ) {
    return { directiveAck: undefined, provider, model };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentCfg = params.agentCfg;
  const { currentThinkLevel, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } =
    await resolveCurrentDirectiveLevels({
      sessionEntry,
      agentCfg,
      resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel(),
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const directiveAck = await handleDirectiveOnly({
    cfg,
    directives,
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    elevatedEnabled,
    elevatedAllowed,
    elevatedFailures,
    messageProviderKey,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelKeys,
    allowedModelCatalog,
    resetModelOverride,
    provider,
    model,
    initialModelLabel: params.initialModelLabel,
    formatModelSwitchEvent,
    currentThinkLevel,
    currentVerboseLevel,
    currentReasoningLevel,
    currentElevatedLevel,
  });

  if (sessionEntry?.providerOverride) {
    provider = sessionEntry.providerOverride;
  }
  if (sessionEntry?.modelOverride) {
    model = sessionEntry.modelOverride;
  }

  return { directiveAck, provider, model };
}
