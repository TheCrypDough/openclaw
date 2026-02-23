/*
 * AUTO ANNOTATION
 * File: ui/src/ui/views/skills-shared.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { html, nothing } from "lit";
import type { SkillStatusEntry } from "../types.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeSkillMissing(skill: SkillStatusEntry): string[] {
  return [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeSkillReasons(skill: SkillStatusEntry): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reasons: string[] = [];
  if (skill.disabled) {
    reasons.push("disabled");
  }
  if (skill.blockedByAllowlist) {
    reasons.push("blocked by allowlist");
  }
  return reasons;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderSkillStatusChips(params: {
  skill: SkillStatusEntry;
  showBundledBadge?: boolean;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const skill = params.skill;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const showBundledBadge = Boolean(params.showBundledBadge);
  return html`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${skill.source}</span>
      ${
        showBundledBadge
          ? html`
              <span class="chip">bundled</span>
            `
          : nothing
      }
      <span class="chip ${skill.eligible ? "chip-ok" : "chip-warn"}">
        ${skill.eligible ? "eligible" : "blocked"}
      </span>
      ${
        skill.disabled
          ? html`
              <span class="chip chip-warn">disabled</span>
            `
          : nothing
      }
    </div>
  `;
}
