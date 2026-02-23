/*
 * AUTO ANNOTATION
 * File: src/gateway/control-ui-shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONTROL_UI_AVATAR_PREFIX = "/avatar";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeControlUiBasePath(basePath?: string): string {
  if (!basePath) {
    return "";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let normalized = basePath.trim();
  if (!normalized) {
    return "";
  }
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized === "/") {
    return "";
  }
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildControlUiAvatarUrl(basePath: string, agentId: string): string {
  return basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/${agentId}`
    : `${CONTROL_UI_AVATAR_PREFIX}/${agentId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function looksLikeLocalAvatarPath(value: string): boolean {
  if (/[\\/]/.test(value)) {
    return true;
  }
  return /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(value);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAssistantAvatarUrl(params: {
  avatar?: string | null;
  agentId?: string | null;
  basePath?: string;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const avatar = params.avatar?.trim();
  if (!avatar) {
    return undefined;
  }
  if (/^https?:\/\//i.test(avatar) || /^data:image\//i.test(avatar)) {
    return avatar;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const basePath = normalizeControlUiBasePath(params.basePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseAvatarPrefix = basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/`
    : `${CONTROL_UI_AVATAR_PREFIX}/`;
  if (basePath && avatar.startsWith(`${CONTROL_UI_AVATAR_PREFIX}/`)) {
    return `${basePath}${avatar}`;
  }
  if (avatar.startsWith(baseAvatarPrefix)) {
    return avatar;
  }

  if (!params.agentId) {
    return avatar;
  }
  if (looksLikeLocalAvatarPath(avatar)) {
    return buildControlUiAvatarUrl(basePath, params.agentId);
  }
  return avatar;
}

export { CONTROL_UI_AVATAR_PREFIX };
