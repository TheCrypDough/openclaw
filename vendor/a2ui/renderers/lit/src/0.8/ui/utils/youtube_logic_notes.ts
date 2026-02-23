/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/renderers/lit/src/0.8/ui/utils/youtube.ts
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

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isEmbedUri(uri: string | null): boolean {
  if (!uri) {
    return false;
  }

  return /^https:\/\/www\.youtube\.com\/embed\//.test(uri);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isShareUri(uri: string | null): boolean {
  if (!uri) {
    return false;
  }

  return /^https:\/\/youtu\.be\//.test(uri);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isWatchUri(uri: string): boolean {
  return /^https:\/\/www\.youtube\.com\/watch\?v=/.test(uri);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isShortsUri(uri: string): boolean {
  return /^https:\/\/www\.youtube\.com\/shorts\//.test(uri);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function convertShareUriToEmbedUri(uri: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const regex = /^https:\/\/youtu\.be\/(.*?)(?:[&\\?]|$)/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matches = regex.exec(uri);
  if (!matches) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embedId = matches[1];
  return `https://www.youtube.com/embed/${embedId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function convertWatchOrShortsUriToEmbedUri(uri: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const regex =
    /^https:\/\/www\.youtube\.com\/(?:shorts\/|embed\/|watch\?v=)(.*?)(?:[&\\?]|$)/;
  const matches = regex.exec(uri);
  if (!matches) {
    return null;
  }

  const embedId = matches[1];
  return `https://www.youtube.com/embed/${embedId}`;
}

export function videoIdFromWatchOrShortsOrEmbedUri(uri: string) {
  const regex =
    /^https:\/\/www\.youtube\.com\/(?:shorts\/|embed\/|watch\?v=)(.*?)(?:[&\\?]|$)/;
  const matches = regex.exec(uri);
  if (!matches) {
    return null;
  }

  return matches[1];
}

export function createWatchUriFromVideoId(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
