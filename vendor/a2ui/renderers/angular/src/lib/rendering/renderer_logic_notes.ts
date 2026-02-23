/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/angular/src/lib/rendering/renderer.ts
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

import {
  Binding,
  ComponentRef,
  Directive,
  DOCUMENT,
  effect,
  inject,
  input,
  inputBinding,
  OnDestroy,
  PLATFORM_ID,
  Type,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { Types, Styles } from '@a2ui/lit/0.8';
import { Catalog } from './catalog';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'ng-container[a2ui-renderer]',
})
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class Renderer implements OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private catalog = inject(Catalog);
  private static hasInsertedStyles = false;

  private currentRef: ComponentRef<unknown> | null = null;
  private isDestroyed = false;

  readonly surfaceId = input.required<Types.SurfaceID>();
  readonly component = input.required<Types.AnyComponentNode>();

  constructor() {
    effect(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const surfaceId = this.surfaceId();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const component = this.component();
      untracked(() => this.render(surfaceId, component));
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const platformId = inject(PLATFORM_ID);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const document = inject(DOCUMENT);

    if (!Renderer.hasInsertedStyles && isPlatformBrowser(platformId)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const styles = document.createElement('style');
      styles.textContent = Styles.structuralStyles;
      document.head.appendChild(styles);
      Renderer.hasInsertedStyles = true;
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.clear();
  }

  private async render(surfaceId: Types.SurfaceID, component: Types.AnyComponentNode) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = this.catalog[component.type];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let newComponent: Type<unknown> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let componentBindings: Binding[] | null = null;

    if (typeof config === 'function') {
      newComponent = await config();
    } else if (typeof config === 'object') {
      newComponent = await config.type();
      componentBindings = config.bindings(component as any);
    }

    this.clear();

    if (newComponent && !this.isDestroyed) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const bindings = [
        inputBinding('surfaceId', () => surfaceId),
        inputBinding('component', () => component),
        inputBinding('weight', () => component.weight ?? 'initial'),
      ];

      if (componentBindings) {
        bindings.push(...componentBindings);
      }

      this.currentRef = this.viewContainerRef.createComponent(newComponent, {
        bindings,
        injector: this.viewContainerRef.injector,
      });
    }
  }

  private clear() {
    this.currentRef?.destroy();
    this.currentRef = null;
  }
}
