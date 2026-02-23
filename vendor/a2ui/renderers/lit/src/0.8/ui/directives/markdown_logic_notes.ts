/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/lit/src/0.8/ui/directives/markdown.ts
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

import { noChange } from "lit";
import {
  Directive,
  DirectiveParameters,
  Part,
  directive,
} from "lit/directive.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import MarkdownIt from "markdown-it";
import { RenderRule } from "markdown-it/lib/renderer.mjs";
import * as Sanitizer from "./sanitizer.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class MarkdownDirective extends Directive {
  #markdownIt = MarkdownIt({
    highlight: (str, lang) => {
      switch (lang) {
        case "html": {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
          const iframe = document.createElement("iframe");
          iframe.classList.add("html-view");
          iframe.srcdoc = str;
          iframe.sandbox = "";
          return iframe.innerHTML;
        }

        default:
          return Sanitizer.escapeNodeText(str);
      }
    },
  });
  #lastValue: string | null = null;
  #lastTagClassMap: string | null = null;

  update(_part: Part, [value, tagClassMap]: DirectiveParameters<this>) {
    if (
      this.#lastValue === value &&
      JSON.stringify(tagClassMap) === this.#lastTagClassMap
    ) {
      return noChange;
    }

    this.#lastValue = value;
    this.#lastTagClassMap = JSON.stringify(tagClassMap);
    return this.render(value, tagClassMap);
  }

  #originalClassMap = new Map<string, RenderRule | undefined>();
  #applyTagClassMap(tagClassMap: Record<string, string[]>) {
    Object.entries(tagClassMap).forEach(([tag]) => {
      let tokenName;
      switch (tag) {
        case "p":
          tokenName = "paragraph";
          break;
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          tokenName = "heading";
          break;
        case "ul":
          tokenName = "bullet_list";
          break;
        case "ol":
          tokenName = "ordered_list";
          break;
        case "li":
          tokenName = "list_item";
          break;
        case "a":
          tokenName = "link";
          break;
        case "strong":
          tokenName = "strong";
          break;
        case "em":
          tokenName = "em";
          break;
      }

      if (!tokenName) {
        return;
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const key = `${tokenName}_open`;
      this.#markdownIt.renderer.rules[key] = (
        tokens,
        idx,
        options,
        _env,
        self
      ) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const token = tokens[idx];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const tokenClasses = tagClassMap[token.tag] ?? [];
        for (const clazz of tokenClasses) {
          token.attrJoin("class", clazz);
        }

        return self.renderToken(tokens, idx, options);
      };
    });
  }

  #unapplyTagClassMap() {
    for (const [key] of this.#originalClassMap) {
      delete this.#markdownIt.renderer.rules[key];
    }

    this.#originalClassMap.clear();
  }

  /**
   * Renders the markdown string to HTML using MarkdownIt.
   *
   * Note: MarkdownIt doesn't enable HTML in its output, so we render the
   * value directly without further sanitization.
   * @see https://github.com/markdown-it/markdown-it/blob/master/docs/security.md
   */
  render(value: string, tagClassMap?: Record<string, string[]>) {
    if (tagClassMap) {
      this.#applyTagClassMap(tagClassMap);
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const htmlString = this.#markdownIt.render(value);
    this.#unapplyTagClassMap();

    return unsafeHTML(htmlString);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const markdown = directive(MarkdownDirective);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const markdownItStandalone = MarkdownIt();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderMarkdownToHtmlString(value: string): string {
  return markdownItStandalone.render(value);
}
