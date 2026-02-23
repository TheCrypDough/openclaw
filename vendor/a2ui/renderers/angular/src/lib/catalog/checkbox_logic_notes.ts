/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/angular/src/lib/catalog/checkbox.ts
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
  selector: 'a2ui-checkbox',
  template: `
    <section
      [class]="theme.components.CheckBox.container"
      [style]="theme.additionalStyles?.CheckBox"
    >
      <input
        autocomplete="off"
        type="checkbox"
        [id]="inputId"
        [checked]="inputChecked()"
        [class]="theme.components.CheckBox.element"
        (change)="handleChange($event)"
      />

      <label [htmlFor]="inputId" [class]="theme.components.CheckBox.label">{{
        resolvedLabel()
      }}</label>
    </section>
  `,
  styles: `
    :host {
      display: block;
      flex: var(--weight);
      min-height: 0;
      overflow: auto;
    }

    input {
      display: block;
      width: 100%;
    }
  `,
})
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class Checkbox extends DynamicComponent {
  readonly value = input.required<Primitives.BooleanValue | null>();
  readonly label = input.required<Primitives.StringValue | null>();

  protected inputChecked = computed(() => super.resolvePrimitive(this.value()) ?? false);
  protected resolvedLabel = computed(() => super.resolvePrimitive(this.label()));
  protected inputId = super.getUniqueId('a2ui-checkbox');

  protected handleChange(event: Event) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const path = this.value()?.path;

    if (!(event.target instanceof HTMLInputElement) || !path) {
      return;
    }

    this.processor.setData(this.component(), path, event.target.checked, this.surfaceId());
  }
}
