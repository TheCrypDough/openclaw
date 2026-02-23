/*
 * AUTO ANNOTATION
 * File: ui/src/ui/chat/copy-as-markdown.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { html, type TemplateResult } from "lit";
import { icons } from "../icons.ts";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const COPIED_FOR_MS = 1500;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ERROR_FOR_MS = 2000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const COPY_LABEL = "Copy as markdown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const COPIED_LABEL = "Copied";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ERROR_LABEL = "Copy failed";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CopyButtonOptions = {
  text: () => string;
  label?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function setButtonLabel(button: HTMLButtonElement, label: string) {
  button.title = label;
  button.setAttribute("aria-label", label);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createCopyButton(options: CopyButtonOptions): TemplateResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idleLabel = options.label ?? COPY_LABEL;
  return html`
    <button
      class="chat-copy-btn"
      type="button"
      title=${idleLabel}
      aria-label=${idleLabel}
      @click=${async (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement | null;

        if (!btn || btn.dataset.copying === "1") {
          return;
        }

        btn.dataset.copying = "1";
        btn.setAttribute("aria-busy", "true");
        btn.disabled = true;

        const copied = await copyTextToClipboard(options.text());
        if (!btn.isConnected) {
          return;
        }

        delete btn.dataset.copying;
        btn.removeAttribute("aria-busy");
        btn.disabled = false;

        if (!copied) {
          btn.dataset.error = "1";
          setButtonLabel(btn, ERROR_LABEL);

          window.setTimeout(() => {
            if (!btn.isConnected) {
              return;
            }
            delete btn.dataset.error;
            setButtonLabel(btn, idleLabel);
          }, ERROR_FOR_MS);
          return;
        }

        btn.dataset.copied = "1";
        setButtonLabel(btn, COPIED_LABEL);

        window.setTimeout(() => {
          if (!btn.isConnected) {
            return;
          }
          delete btn.dataset.copied;
          setButtonLabel(btn, idleLabel);
        }, COPIED_FOR_MS);
      }}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${icons.copy}</span>
        <span class="chat-copy-btn__icon-check">${icons.check}</span>
      </span>
    </button>
  `;
}

export function renderCopyAsMarkdownButton(markdown: string): TemplateResult {
  return createCopyButton({ text: () => markdown, label: COPY_LABEL });
}
