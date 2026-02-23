/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/angular/src/lib/data/processor.ts
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

import { Data, Types } from '@a2ui/lit/0.8';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

export interface DispatchedEvent {
  message: Types.A2UIClientEventMessage;
  completion: Subject<Types.ServerToClientMessage[]>;
}

@Injectable({ providedIn: 'root' })
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class MessageProcessor extends Data.A2uiMessageProcessor {
  readonly events = new Subject<DispatchedEvent>();

  override setData(
    node: Types.AnyComponentNode,
    relativePath: string,
    value: Types.DataValue,
    surfaceId?: Types.SurfaceID | null,
  ) {
    // Override setData to convert from optional inputs (which can be null)
    // to undefined so that this correctly falls back to the default value for
    // surfaceId.
    return super.setData(node, relativePath, value, surfaceId ?? undefined);
  }

  dispatch(message: Types.A2UIClientEventMessage): Promise<Types.ServerToClientMessage[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const completion = new Subject<Types.ServerToClientMessage[]>();
    this.events.next({ message, completion });
    return firstValueFrom(completion);
  }
}
