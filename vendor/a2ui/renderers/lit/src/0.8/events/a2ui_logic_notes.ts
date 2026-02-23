/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/lit/src/0.8/events/a2ui.ts
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

import { Action } from "../types/components.js";
import { AnyComponentNode } from "../types/types.js";
import { BaseEventDetail } from "./base.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Namespace = "a2ui";

export interface A2UIAction extends BaseEventDetail<`${Namespace}.action`> {
  readonly action: Action;
  readonly dataContextPath: string;
  readonly sourceComponentId: string;
  readonly sourceComponent: AnyComponentNode | null;
}
