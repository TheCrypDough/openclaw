/*
 * AUTO ANNOTATION
 * File: src/security/dm-policy-shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChannelId } from "../channels/plugins/types.js";
import { readChannelAllowFromStore } from "../pairing/pairing-store.js";
import { normalizeStringEntries } from "../shared/string-normalization.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEffectiveAllowFromLists(params: {
  allowFrom?: Array<string | number> | null;
  groupAllowFrom?: Array<string | number> | null;
  storeAllowFrom?: Array<string | number> | null;
  dmPolicy?: string | null;
}): {
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configAllowFrom = normalizeStringEntries(
    Array.isArray(params.allowFrom) ? params.allowFrom : undefined,
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configGroupAllowFrom = normalizeStringEntries(
    Array.isArray(params.groupAllowFrom) ? params.groupAllowFrom : undefined,
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeAllowFrom =
    params.dmPolicy === "allowlist"
      ? []
      : normalizeStringEntries(
          Array.isArray(params.storeAllowFrom) ? params.storeAllowFrom : undefined,
        );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveAllowFrom = normalizeStringEntries([...configAllowFrom, ...storeAllowFrom]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupBase = configGroupAllowFrom.length > 0 ? configGroupAllowFrom : configAllowFrom;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveGroupAllowFrom = normalizeStringEntries([...groupBase, ...storeAllowFrom]);
  return { effectiveAllowFrom, effectiveGroupAllowFrom };
}

export type DmGroupAccessDecision = "allow" | "block" | "pairing";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDmGroupAccessDecision(params: {
  isGroup: boolean;
  dmPolicy?: string | null;
  groupPolicy?: string | null;
  effectiveAllowFrom: Array<string | number>;
  effectiveGroupAllowFrom: Array<string | number>;
  isSenderAllowed: (allowFrom: string[]) => boolean;
}): {
  decision: DmGroupAccessDecision;
  reason: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dmPolicy = params.dmPolicy ?? "pairing";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupPolicy = params.groupPolicy ?? "allowlist";
  const effectiveAllowFrom = normalizeStringEntries(params.effectiveAllowFrom);
  const effectiveGroupAllowFrom = normalizeStringEntries(params.effectiveGroupAllowFrom);

  if (params.isGroup) {
    if (groupPolicy === "disabled") {
      return { decision: "block", reason: "groupPolicy=disabled" };
    }
    if (groupPolicy === "allowlist") {
      if (effectiveGroupAllowFrom.length === 0) {
        return { decision: "block", reason: "groupPolicy=allowlist (empty allowlist)" };
      }
      if (!params.isSenderAllowed(effectiveGroupAllowFrom)) {
        return { decision: "block", reason: "groupPolicy=allowlist (not allowlisted)" };
      }
    }
    return { decision: "allow", reason: `groupPolicy=${groupPolicy}` };
  }

  if (dmPolicy === "disabled") {
    return { decision: "block", reason: "dmPolicy=disabled" };
  }
  if (dmPolicy === "open") {
    return { decision: "allow", reason: "dmPolicy=open" };
  }
  if (params.isSenderAllowed(effectiveAllowFrom)) {
    return { decision: "allow", reason: `dmPolicy=${dmPolicy} (allowlisted)` };
  }
  if (dmPolicy === "pairing") {
    return { decision: "pairing", reason: "dmPolicy=pairing (not allowlisted)" };
  }
  return { decision: "block", reason: `dmPolicy=${dmPolicy} (not allowlisted)` };
}

export async function resolveDmAllowState(params: {
  provider: ChannelId;
  allowFrom?: Array<string | number> | null;
  normalizeEntry?: (raw: string) => string;
  readStore?: (provider: ChannelId) => Promise<string[]>;
}): Promise<{
  configAllowFrom: string[];
  hasWildcard: boolean;
  allowCount: number;
  isMultiUserDm: boolean;
}> {
  const configAllowFrom = normalizeStringEntries(
    Array.isArray(params.allowFrom) ? params.allowFrom : undefined,
  );
  const hasWildcard = configAllowFrom.includes("*");
  const storeAllowFrom = await (params.readStore ?? readChannelAllowFromStore)(
    params.provider,
  ).catch(() => []);
  const normalizeEntry = params.normalizeEntry ?? ((value: string) => value);
  const normalizedCfg = configAllowFrom
    .filter((value) => value !== "*")
    .map((value) => normalizeEntry(value))
    .map((value) => value.trim())
    .filter(Boolean);
  const normalizedStore = storeAllowFrom
    .map((value) => normalizeEntry(value))
    .map((value) => value.trim())
    .filter(Boolean);
  const allowCount = Array.from(new Set([...normalizedCfg, ...normalizedStore])).length;
  return {
    configAllowFrom,
    hasWildcard,
    allowCount,
    isMultiUserDm: hasWildcard || allowCount > 1,
  };
}
