/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/lit/src/0.8/events/events.ts
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

import type * as A2UI from "./a2ui.js";
import { BaseEventDetail } from "./base.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const eventInit = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

type EnforceEventTypeMatch<T extends Record<string, BaseEventDetail<string>>> =
  {
    [K in keyof T]: T[K] extends BaseEventDetail<infer EventType>
      ? EventType extends K
        ? T[K]
        : never
      : never;
  };

export type StateEventDetailMap = EnforceEventTypeMatch<{
  "a2ui.action": A2UI.A2UIAction;
}>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class StateEvent<
  T extends keyof StateEventDetailMap
> extends CustomEvent<StateEventDetailMap[T]> {
  static eventName = "a2uiaction";

  constructor(readonly payload: StateEventDetailMap[T]) {
    super(StateEvent.eventName, { detail: payload, ...eventInit });
  }
}

declare global {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  interface HTMLElementEventMap {
    a2uiaction: StateEvent<"a2ui.action">;
  }
}
