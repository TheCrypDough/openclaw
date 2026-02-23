/*
 * AUTO ANNOTATION
 * File: src/shared/entry-status.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveEmojiAndHomepage } from "./entry-metadata.js";
import {
  evaluateRequirementsFromMetadataWithRemote,
  type RequirementConfigCheck,
  type RequirementRemote,
  type Requirements,
  type RequirementsMetadata,
} from "./requirements.js";

export type EntryMetadataRequirementsParams = Parameters<
  typeof evaluateEntryMetadataRequirements
>[0];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function evaluateEntryMetadataRequirements(params: {
  always: boolean;
  metadata?: (RequirementsMetadata & { emoji?: string; homepage?: string }) | null;
  frontmatter?: {
    emoji?: string;
    homepage?: string;
    website?: string;
    url?: string;
  } | null;
  hasLocalBin: (bin: string) => boolean;
  localPlatform: string;
  remote?: RequirementRemote;
  isEnvSatisfied: (envName: string) => boolean;
  isConfigSatisfied: (pathStr: string) => boolean;
}): {
  emoji?: string;
  homepage?: string;
  required: Requirements;
  missing: Requirements;
  requirementsSatisfied: boolean;
  configChecks: RequirementConfigCheck[];
} {
  const { emoji, homepage } = resolveEmojiAndHomepage({
    metadata: params.metadata,
    frontmatter: params.frontmatter,
  });
  const { required, missing, eligible, configChecks } = evaluateRequirementsFromMetadataWithRemote({
    always: params.always,
    metadata: params.metadata ?? undefined,
    hasLocalBin: params.hasLocalBin,
    localPlatform: params.localPlatform,
    remote: params.remote,
    isEnvSatisfied: params.isEnvSatisfied,
    isConfigSatisfied: params.isConfigSatisfied,
  });
  return {
    ...(emoji ? { emoji } : {}),
    ...(homepage ? { homepage } : {}),
    required,
    missing,
    requirementsSatisfied: eligible,
    configChecks,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function evaluateEntryMetadataRequirementsForCurrentPlatform(
  params: Omit<EntryMetadataRequirementsParams, "localPlatform">,
): ReturnType<typeof evaluateEntryMetadataRequirements> {
  return evaluateEntryMetadataRequirements({
    ...params,
    localPlatform: process.platform,
  });
}
