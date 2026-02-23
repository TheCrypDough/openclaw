/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/angular/src/lib/catalog/multiple-choice.ts
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

import { Component, computed, input } from '@angular/core';
import { DynamicComponent } from '../rendering/dynamic-component';
import { Primitives } from '@a2ui/lit/0.8';

@Component({
  selector: 'a2ui-multiple-choice',
  template: `
    <section [class]="theme.components.MultipleChoice.container">
      <label [class]="theme.components.MultipleChoice.label" [for]="selectId">{{
        description()
      }}</label>

      <select
        (change)="handleChange($event)"
        [id]="selectId"
        [value]="selectValue()"
        [class]="theme.components.MultipleChoice.element"
        [style]="theme.additionalStyles?.MultipleChoice"
      >
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ resolvePrimitive(option.label) }}</option>
        }
      </select>
    </section>
  `,
  styles: `
    :host {
      display: block;
      flex: var(--weight);
      min-height: 0;
      overflow: auto;
    }

    select {
      width: 100%;
      box-sizing: border-box;
    }
  `,
})
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class MultipleChoice extends DynamicComponent {
  readonly options = input.required<{ label: Primitives.StringValue; value: string }[]>();
  readonly value = input.required<Primitives.StringValue | null>();
  readonly description = input.required<string>();

  protected readonly selectId = super.getUniqueId('a2ui-multiple-choice');
  protected selectValue = computed(() => super.resolvePrimitive(this.value()));

  protected handleChange(event: Event) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = this.value()?.path;

    if (!(event.target instanceof HTMLSelectElement) || !event.target.value || !path) {
      return;
    }

    this.processor.setData(
      this.component(),
      this.processor.resolvePath(path, this.component().dataContextPath),
      event.target.value,
    );
  }
}
