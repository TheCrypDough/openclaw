/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/specification/0.9/eval/src/utils.ts
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
export function extractJsonFromMarkdown(markdown: string): any[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matches = [...markdown.matchAll(jsonBlockRegex)];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const results: any[] = [];

  for (const match of matches) {
    if (match[1]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const content = match[1].trim();
      // Try parsing as a single JSON object first
      try {
        results.push(JSON.parse(content));
      } catch (error) {
        // If that fails, try parsing as JSONL (line by line)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const lines = content.split("\n");
        for (const line of lines) {
          if (line.trim()) {
            try {
              results.push(JSON.parse(line));
            } catch (e2) {
              // Ignore invalid lines
            }
          }
        }
      }
    }
  }
  return results;
}
