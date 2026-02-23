/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/lit/src/0.8/ui/video.ts
 * Purpose: File in vendor area for project orchestration/configuration/data.
 * Module area: Vendored third-party code/assets (e.g., bundled UI runtime)
 * System effect: Change can influence vendored third-party code/assets (e.g., bundled ui runtime) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Root } from "./root.js";
import { StringValue } from "../types/primitives.js";
import { A2uiMessageProcessor } from "../data/model-processor.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { structuralStyles } from "./styles.js";

@customElement("a2ui-video")
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class Video extends Root {
  @property()
  accessor url: StringValue | null = null;

  static styles = [
    structuralStyles,
    css`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      video {
        display: block;
        width: 100%;
      }
    `,
  ];

  #renderVideo() {
    if (!this.url) {
      return nothing;
    }

    if (this.url && typeof this.url === "object") {
      if ("literalString" in this.url) {
        return html`<video controls src=${this.url.literalString} />`;
      } else if ("literal" in this.url) {
        return html`<video controls src=${this.url.literal} />`;
      } else if (this.url && "path" in this.url && this.url.path) {
        if (!this.processor || !this.component) {
          return html`(no processor)`;
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const videoUrl = this.processor.getData(
          this.component,
          this.url.path,
          this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
        );
        if (!videoUrl) {
          return html`Invalid video URL`;
        }

        if (typeof videoUrl !== "string") {
          return html`Invalid video URL`;
        }
        return html`<video controls src=${videoUrl} />`;
      }
    }

    return html`(empty)`;
  }

  render() {
    return html`<section
      class=${classMap(this.theme.components.Video)}
      style=${this.theme.additionalStyles?.Video
        ? styleMap(this.theme.additionalStyles?.Video)
        : nothing}
    >
      ${this.#renderVideo()}
    </section>`;
  }
}
