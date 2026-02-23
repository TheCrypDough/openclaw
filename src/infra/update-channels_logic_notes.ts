/*
 * AUTO ANNOTATION
 * File: src/infra/update-channels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type UpdateChannel = "stable" | "beta" | "dev";
export type UpdateChannelSource = "config" | "git-tag" | "git-branch" | "default";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_PACKAGE_CHANNEL: UpdateChannel = "stable";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GIT_CHANNEL: UpdateChannel = "dev";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEV_BRANCH = "main";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeUpdateChannel(value?: string | null): UpdateChannel | null {
  if (!value) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim().toLowerCase();
  if (normalized === "stable" || normalized === "beta" || normalized === "dev") {
    return normalized;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function channelToNpmTag(channel: UpdateChannel): string {
  if (channel === "beta") {
    return "beta";
  }
  if (channel === "dev") {
    return "dev";
  }
  return "latest";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBetaTag(tag: string): boolean {
  return tag.toLowerCase().includes("-beta");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isStableTag(tag: string): boolean {
  return !isBetaTag(tag);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEffectiveUpdateChannel(params: {
  configChannel?: UpdateChannel | null;
  installKind: "git" | "package" | "unknown";
  git?: { tag?: string | null; branch?: string | null };
}): { channel: UpdateChannel; source: UpdateChannelSource } {
  if (params.configChannel) {
    return { channel: params.configChannel, source: "config" };
  }

  if (params.installKind === "git") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tag = params.git?.tag;
    if (tag) {
      return { channel: isBetaTag(tag) ? "beta" : "stable", source: "git-tag" };
    }
    const branch = params.git?.branch;
    if (branch && branch !== "HEAD") {
      return { channel: "dev", source: "git-branch" };
    }
    return { channel: DEFAULT_GIT_CHANNEL, source: "default" };
  }

  if (params.installKind === "package") {
    return { channel: DEFAULT_PACKAGE_CHANNEL, source: "default" };
  }

  return { channel: DEFAULT_PACKAGE_CHANNEL, source: "default" };
}

export function formatUpdateChannelLabel(params: {
  channel: UpdateChannel;
  source: UpdateChannelSource;
  gitTag?: string | null;
  gitBranch?: string | null;
}): string {
  if (params.source === "config") {
    return `${params.channel} (config)`;
  }
  if (params.source === "git-tag") {
    return params.gitTag ? `${params.channel} (${params.gitTag})` : `${params.channel} (tag)`;
  }
  if (params.source === "git-branch") {
    return params.gitBranch
      ? `${params.channel} (${params.gitBranch})`
      : `${params.channel} (branch)`;
  }
  return `${params.channel} (default)`;
}

export function resolveUpdateChannelDisplay(params: {
  configChannel?: UpdateChannel | null;
  installKind: "git" | "package" | "unknown";
  gitTag?: string | null;
  gitBranch?: string | null;
}): { channel: UpdateChannel; source: UpdateChannelSource; label: string } {
  const channelInfo = resolveEffectiveUpdateChannel({
    configChannel: params.configChannel,
    installKind: params.installKind,
    git:
      params.gitTag || params.gitBranch
        ? { tag: params.gitTag ?? null, branch: params.gitBranch ?? null }
        : undefined,
  });
  return {
    channel: channelInfo.channel,
    source: channelInfo.source,
    label: formatUpdateChannelLabel({
      channel: channelInfo.channel,
      source: channelInfo.source,
      gitTag: params.gitTag ?? null,
      gitBranch: params.gitBranch ?? null,
    }),
  };
}
