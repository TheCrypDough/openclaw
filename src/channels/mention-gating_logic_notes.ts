/*
 * AUTO ANNOTATION
 * File: src/channels/mention-gating.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type MentionGateParams = {
  requireMention: boolean;
  canDetectMention: boolean;
  wasMentioned: boolean;
  implicitMention?: boolean;
  shouldBypassMention?: boolean;
};

export type MentionGateResult = {
  effectiveWasMentioned: boolean;
  shouldSkip: boolean;
};

export type MentionGateWithBypassParams = {
  isGroup: boolean;
  requireMention: boolean;
  canDetectMention: boolean;
  wasMentioned: boolean;
  implicitMention?: boolean;
  hasAnyMention?: boolean;
  allowTextCommands: boolean;
  hasControlCommand: boolean;
  commandAuthorized: boolean;
};

export type MentionGateWithBypassResult = MentionGateResult & {
  shouldBypassMention: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMentionGating(params: MentionGateParams): MentionGateResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const implicit = params.implicitMention === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const bypass = params.shouldBypassMention === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveWasMentioned = params.wasMentioned || implicit || bypass;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldSkip = params.requireMention && params.canDetectMention && !effectiveWasMentioned;
  return { effectiveWasMentioned, shouldSkip };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMentionGatingWithBypass(
  params: MentionGateWithBypassParams,
): MentionGateWithBypassResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldBypassMention =
    params.isGroup &&
    params.requireMention &&
    !params.wasMentioned &&
    !(params.hasAnyMention ?? false) &&
    params.allowTextCommands &&
    params.commandAuthorized &&
    params.hasControlCommand;
  return {
    ...resolveMentionGating({
      requireMention: params.requireMention,
      canDetectMention: params.canDetectMention,
      wasMentioned: params.wasMentioned,
      implicitMention: params.implicitMention,
      shouldBypassMention,
    }),
    shouldBypassMention,
  };
}
