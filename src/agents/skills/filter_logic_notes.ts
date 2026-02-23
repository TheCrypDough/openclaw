/*
 * AUTO ANNOTATION
 * File: src/agents/skills/filter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSkillFilter(skillFilter?: ReadonlyArray<unknown>): string[] | undefined {
  if (skillFilter === undefined) {
    return undefined;
  }
  return skillFilter.map((entry) => String(entry).trim()).filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSkillFilterForComparison(
  skillFilter?: ReadonlyArray<unknown>,
): string[] | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeSkillFilter(skillFilter);
  if (normalized === undefined) {
    return undefined;
  }
  return Array.from(new Set(normalized)).toSorted();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function matchesSkillFilter(
  cached?: ReadonlyArray<unknown>,
  next?: ReadonlyArray<unknown>,
): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cachedNormalized = normalizeSkillFilterForComparison(cached);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nextNormalized = normalizeSkillFilterForComparison(next);
  if (cachedNormalized === undefined || nextNormalized === undefined) {
    return cachedNormalized === nextNormalized;
  }
  if (cachedNormalized.length !== nextNormalized.length) {
    return false;
  }
  return cachedNormalized.every((entry, index) => entry === nextNormalized[index]);
}
