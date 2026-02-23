/*
 * AUTO ANNOTATION
 * File: ui/src/ui/views/skills-grouping.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SkillStatusEntry } from "../types.ts";

export type SkillGroup = {
  id: string;
  label: string;
  skills: SkillStatusEntry[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SKILL_SOURCE_GROUPS: Array<{ id: string; label: string; sources: string[] }> = [
  { id: "workspace", label: "Workspace Skills", sources: ["openclaw-workspace"] },
  { id: "built-in", label: "Built-in Skills", sources: ["openclaw-bundled"] },
  { id: "installed", label: "Installed Skills", sources: ["openclaw-managed"] },
  { id: "extra", label: "Extra Skills", sources: ["openclaw-extra"] },
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function groupSkills(skills: SkillStatusEntry[]): SkillGroup[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groups = new Map<string, SkillGroup>();
  for (const def of SKILL_SOURCE_GROUPS) {
    groups.set(def.id, { id: def.id, label: def.label, skills: [] });
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const builtInGroup = SKILL_SOURCE_GROUPS.find((group) => group.id === "built-in");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const other: SkillGroup = { id: "other", label: "Other Skills", skills: [] };
  for (const skill of skills) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = skill.bundled
      ? builtInGroup
      : SKILL_SOURCE_GROUPS.find((group) => group.sources.includes(skill.source));
    if (match) {
      groups.get(match.id)?.skills.push(skill);
    } else {
      other.skills.push(skill);
    }
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ordered = SKILL_SOURCE_GROUPS.map((group) => groups.get(group.id)).filter(
    (group): group is SkillGroup => Boolean(group && group.skills.length > 0),
  );
  if (other.skills.length > 0) {
    ordered.push(other);
  }
  return ordered;
}
