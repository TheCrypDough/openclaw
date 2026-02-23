/*
 * AUTO ANNOTATION
 * File: ui/src/ui/views/exec-approval.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatRemaining(ms: number): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remaining = Math.max(0, ms);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const totalSeconds = Math.floor(remaining / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function renderMetaRow(label: string, value?: string | null) {
  if (!value) {
    return nothing;
  }
  return html`<div class="exec-approval-meta-row"><span>${label}</span><span>${value}</span></div>`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderExecApprovalPrompt(state: AppViewState) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const active = state.execApprovalQueue[0];
  if (!active) {
    return nothing;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const request = active.request;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remainingMs = active.expiresAtMs - Date.now();
  const remaining = remainingMs > 0 ? `expires in ${formatRemaining(remainingMs)}` : "expired";
  const queueCount = state.execApprovalQueue.length;
  return html`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${remaining}</div>
          </div>
          ${
            queueCount > 1
              ? html`<div class="exec-approval-queue">${queueCount} pending</div>`
              : nothing
          }
        </div>
        <div class="exec-approval-command mono">${request.command}</div>
        <div class="exec-approval-meta">
          ${renderMetaRow("Host", request.host)}
          ${renderMetaRow("Agent", request.agentId)}
          ${renderMetaRow("Session", request.sessionKey)}
          ${renderMetaRow("CWD", request.cwd)}
          ${renderMetaRow("Resolved", request.resolvedPath)}
          ${renderMetaRow("Security", request.security)}
          ${renderMetaRow("Ask", request.ask)}
        </div>
        ${
          state.execApprovalError
            ? html`<div class="exec-approval-error">${state.execApprovalError}</div>`
            : nothing
        }
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("allow-once")}
          >
            Allow once
          </button>
          <button
            class="btn"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("allow-always")}
          >
            Always allow
          </button>
          <button
            class="btn danger"
            ?disabled=${state.execApprovalBusy}
            @click=${() => state.handleExecApprovalDecision("deny")}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  `;
}
