/*
 * AUTO ANNOTATION
 * File: ui/src/ui/views/instances.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { html, nothing } from "lit";
import { formatPresenceAge, formatPresenceSummary } from "../presenter.ts";
import type { PresenceEntry } from "../types.ts";

export type InstancesProps = {
  loading: boolean;
  entries: PresenceEntry[];
  lastError: string | null;
  statusMessage: string | null;
  onRefresh: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderInstances(props: InstancesProps) {
  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
          ${props.loading ? "Loading…" : "Refresh"}
        </button>
      </div>
      ${
        props.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${props.lastError}
          </div>`
          : nothing
      }
      ${
        props.statusMessage
          ? html`<div class="callout" style="margin-top: 12px;">
            ${props.statusMessage}
          </div>`
          : nothing
      }
      <div class="list" style="margin-top: 16px;">
        ${
          props.entries.length === 0
            ? html`
                <div class="muted">No instances reported yet.</div>
              `
            : props.entries.map((entry) => renderEntry(entry))
        }
      </div>
    </section>
  `;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function renderEntry(entry: PresenceEntry) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lastInput = entry.lastInputSeconds != null ? `${entry.lastInputSeconds}s ago` : "n/a";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = entry.mode ?? "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const roles = Array.isArray(entry.roles) ? entry.roles.filter(Boolean) : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopes = Array.isArray(entry.scopes) ? entry.scopes.filter(Boolean) : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopesLabel =
    scopes.length > 0
      ? scopes.length > 3
        ? `${scopes.length} scopes`
        : `scopes: ${scopes.join(", ")}`
      : null;
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${entry.host ?? "unknown host"}</div>
        <div class="list-sub">${formatPresenceSummary(entry)}</div>
        <div class="chip-row">
          <span class="chip">${mode}</span>
          ${roles.map((role) => html`<span class="chip">${role}</span>`)}
          ${scopesLabel ? html`<span class="chip">${scopesLabel}</span>` : nothing}
          ${entry.platform ? html`<span class="chip">${entry.platform}</span>` : nothing}
          ${entry.deviceFamily ? html`<span class="chip">${entry.deviceFamily}</span>` : nothing}
          ${
            entry.modelIdentifier
              ? html`<span class="chip">${entry.modelIdentifier}</span>`
              : nothing
          }
          ${entry.version ? html`<span class="chip">${entry.version}</span>` : nothing}
        </div>
      </div>
      <div class="list-meta">
        <div>${formatPresenceAge(entry)}</div>
        <div class="muted">Last input ${lastInput}</div>
        <div class="muted">Reason ${entry.reason ?? ""}</div>
      </div>
    </div>
  `;
}
