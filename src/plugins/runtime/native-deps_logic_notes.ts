/*
 * AUTO ANNOTATION
 * File: src/plugins/runtime/native-deps.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type NativeDependencyHintParams = {
  packageName: string;
  manager?: "pnpm" | "npm" | "yarn";
  rebuildCommand?: string;
  approveBuildsCommand?: string;
  downloadCommand?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatNativeDependencyHint(params: NativeDependencyHintParams): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const manager = params.manager ?? "pnpm";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rebuildCommand =
    params.rebuildCommand ??
    (manager === "npm"
      ? `npm rebuild ${params.packageName}`
      : manager === "yarn"
        ? `yarn rebuild ${params.packageName}`
        : `pnpm rebuild ${params.packageName}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const approveBuildsCommand =
    params.approveBuildsCommand ??
    (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const steps = [approveBuildsCommand, rebuildCommand, params.downloadCommand].filter(
    (step): step is string => Boolean(step),
  );
  if (steps.length === 0) {
    return `Install ${params.packageName} and rebuild its native module.`;
  }
  return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
